"use server";

import { redirect } from "next/navigation";
import { activateDemoBilling, replaceDemoCard, subscriptionFor } from "./billing";
import { expiryInFuture } from "./cards";
import { addMonths, dollarsToCents } from "./format";
import { billingMode } from "./mode";
import { clientAddress, requestOrigin, requireAdmin, requireCustomer, requireUser } from "./guards";
import { hashPassword, hashToken, newId, randomToken, tokensMatch, verifyPassword } from "./passwords";
import { limited } from "./rate-limit";
import { createSessionToken, setSessionCookie, clearSessionCookie } from "./session";
import { createCheckout, setStripeCancel, setStripePause, updateStripeAmount } from "./stripe-billing";
import { findUser, findUserByEmail, getStore, logEvent, mutate } from "./store";
import { syncBilling } from "./sync";
import { clip, emailOk, oneLine, safeNext } from "./text";
import type { Invite, Subscription, User } from "./types";

function redirectNotice(path: string, notice: string): never {
  const join = path.includes("?") ? "&" : "?";
  redirect(`${path}${join}notice=${encodeURIComponent(notice)}`);
}

export async function login(_prev: { error: string }, formData: FormData): Promise<{ error: string }> {
  const email = oneLine(formData.get("email"), 160).toLowerCase();
  const password = String(formData.get("password") || "");
  const next = oneLine(formData.get("next"), 300);
  if (!emailOk(email) || !password || password.length > 200) {
    return { error: "Email or password is incorrect." };
  }
  if (limited(`login:${email}`, 8, 15 * 60 * 1000)) {
    return { error: "Too many attempts. Wait a few minutes and try again." };
  }
  const user = findUserByEmail(getStore(), email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Email or password is incorrect." };
  }
  await setSessionCookie(createSessionToken(user));
  redirect(safeNext(next, user.role) || (user.role === "admin" ? "/admin" : "/portal"));
}

export async function logout() {
  await clearSessionCookie();
  redirect("/");
}

export async function acceptInvite(_prev: { error: string }, formData: FormData): Promise<{ error: string }> {
  const token = oneLine(formData.get("token"), 200);
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  const agree = formData.get("agree") === "on";
  if (!agree) return { error: "Agree to the terms, privacy notice, and billing terms to open the account." };
  if (password.length < 10 || password.length > 200) return { error: "Use a password of at least 10 characters." };
  if (password !== confirm) return { error: "Those passwords do not match." };
  if (limited(`invite:${token.slice(0, 16)}`, 8, 15 * 60 * 1000)) {
    return { error: "Too many attempts. Wait a few minutes." };
  }

  const result = await mutate((store) => {
    const invite = store.invites.find((item) => item.token === token);
    if (!invite || invite.revokedAt) return { ok: false as const, error: "This invite is no longer valid." };
    if (invite.acceptedAt) return { ok: false as const, error: "This invite has already been used. Sign in instead." };
    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      return { ok: false as const, error: "This invite has expired. Ask the studio for a new link." };
    }
    if (findUserByEmail(store, invite.email)) {
      return { ok: false as const, error: "An account with this email already exists. Sign in, or ask the studio to reset it." };
    }
    const now = new Date().toISOString();
    const user: User = {
      id: newId("usr"),
      email: invite.email,
      name: invite.name,
      company: invite.company,
      passwordHash: hashPassword(password),
      role: "customer",
      createdAt: now,
      acceptedTermsAt: now,
      resetTokenHash: null,
      resetExpiresAt: null,
      stripeCustomerId: null,
      mustChangePassword: false,
    };
    const subscription: Subscription = {
      id: newId("sub"),
      userId: user.id,
      inviteId: invite.id,
      siteName: invite.siteName,
      hostingLabel: invite.hostingLabel,
      monthlyAmountCents: invite.monthlyAmountCents,
      currency: "usd",
      status: "awaiting_payment",
      processor: billingMode(),
      paymentMethod: null,
      autopay: false,
      cancelAtPeriodEnd: false,
      cancelRequestedAt: null,
      nextBillAt: null,
      startedAt: null,
      canceledAt: null,
      adminNote: "",
      createdAt: now,
      updatedAt: now,
      stripeSubscriptionId: null,
      stripePaymentMethodId: null,
      lastSyncedAt: null,
    };
    store.users.push(user);
    store.subscriptions.unshift(subscription);
    invite.acceptedAt = now;
    invite.acceptedUserId = user.id;
    logEvent(store, `${invite.name} opened a hosting account for ${invite.siteName}.`, `/admin/clients/${user.id}`);
    return { ok: true as const, userId: user.id };
  });

  if (!result.ok) return { error: result.error };
  const user = findUser(getStore(), result.userId);
  if (!user) return { error: "The account could not be opened. Try the link again." };
  await setSessionCookie(createSessionToken(user));
  redirect("/portal/billing?welcome=1");
}

export async function savePaymentMethod(input: {
  name: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  postal: string;
  authorized: boolean;
}): Promise<{ error: string } | { ok: true }> {
  const user = await requireCustomer();
  if (!input.authorized) return { error: "Authorize the monthly charge to continue." };
  const name = oneLine(input.name, 80);
  const postal = oneLine(input.postal, 12);
  const last4 = input.last4.replace(/\D/g, "");
  if (!name || postal.length < 3) return { error: "Add the name on the card and a billing postal code." };
  if (!/^\d{4}$/.test(last4)) return { error: "Check the card number." };
  if (!expiryInFuture(input.expMonth, input.expYear)) return { error: "That card is expired." };
  const allowed = ["visa", "mastercard", "amex", "discover", "card"];
  if (!allowed.includes(input.brand)) return { error: "Check the card number." };

  const outcome = await mutate((store) => {
    const sub = subscriptionFor(store, user.id);
    if (!sub) return "missing" as const;
    if (sub.processor !== "demo") return "stripe" as const;
    if (sub.status === "canceled") return "canceled" as const;
    const method = {
      brand: input.brand,
      last4,
      expMonth: input.expMonth,
      expYear: input.expYear,
      name,
      postal,
      addedAt: new Date().toISOString(),
      providerId: null,
    };
    if (!sub.paymentMethod) activateDemoBilling(store, sub, method);
    else replaceDemoCard(sub, method);
    return "ok" as const;
  });

  if (outcome === "missing") return { error: "No hosting account is attached to this login." };
  if (outcome === "stripe") return { error: "This account bills through Stripe. Use the secure payment button." };
  if (outcome === "canceled") return { error: "This hosting subscription has ended." };
  return { ok: true };
}

export async function startStripeCheckout() {
  const user = await requireCustomer();
  const store = getStore();
  const sub = subscriptionFor(store, user.id);
  const full = findUser(store, user.id);
  if (!sub || !full) redirectNotice("/portal", "missing");
  if (sub.processor !== "stripe") redirectNotice("/portal/billing", "demo-mode");
  if (sub.status === "canceled") redirectNotice("/portal/billing", "canceled");
  let destination = "";
  let customerId = full.stripeCustomerId;
  try {
    const result = await createCheckout({
      origin: await requestOrigin(),
      email: full.email,
      name: full.name,
      subscription: sub,
      stripeCustomerId: full.stripeCustomerId,
      mode: sub.stripeSubscriptionId ? "setup" : "subscription",
    });
    if ("error" in result || !result.url) redirectNotice("/portal/billing", "stripe-error");
    destination = result.url;
    customerId = result.customerId;
  } catch (error) {
    console.error(error);
    redirectNotice("/portal/billing", "stripe-error");
  }
  if (customerId && customerId !== full.stripeCustomerId) {
    await mutate((current) => {
      const row = findUser(current, user.id);
      if (row) row.stripeCustomerId = customerId;
    });
  }
  redirect(destination);
}

export async function requestCancellation() {
  const user = await requireCustomer();
  const existing = subscriptionFor(getStore(), user.id);
  if (!existing || existing.status === "canceled" || existing.status === "awaiting_payment") {
    redirectNotice("/portal", "cancel-unavailable");
  }
  if (existing.processor === "stripe" && existing.stripeSubscriptionId) {
    try {
      await setStripeCancel(existing, true, false);
    } catch (error) {
      console.error(error);
    }
  }
  await mutate((store) => {
    const sub = subscriptionFor(store, user.id);
    if (!sub || sub.status === "canceled") return;
    sub.cancelAtPeriodEnd = true;
    sub.cancelRequestedAt = new Date().toISOString();
    sub.updatedAt = sub.cancelRequestedAt;
    logEvent(store, `${sub.siteName} requested cancellation.`, `/admin/clients/${user.id}`);
  });
  redirectNotice("/portal", "cancel-requested");
}

export async function changeOwnPassword(_prev: { error: string }, formData: FormData): Promise<{ error: string }> {
  const session = await requireUser();
  if (!session) return { error: "Sign in again." };
  const current = String(formData.get("current") || "");
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  if (password.length < 10 || password.length > 200) return { error: "Use a password of at least 10 characters." };
  if (password !== confirm) return { error: "Those passwords do not match." };
  const full = findUser(getStore(), session.id);
  if (!full || !verifyPassword(current, full.passwordHash)) return { error: "Current password is incorrect." };
  await mutate((store) => {
    const row = findUser(store, session.id);
    if (!row) return;
    row.passwordHash = hashPassword(password);
    row.mustChangePassword = false;
  });
  redirectNotice(session.role === "admin" ? "/admin/settings" : "/portal/account", "password-changed");
}

export async function resetPassword(_prev: { error: string }, formData: FormData): Promise<{ error: string }> {
  const token = oneLine(formData.get("token"), 200);
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  if (password.length < 10 || password.length > 200) return { error: "Use a password of at least 10 characters." };
  if (password !== confirm) return { error: "Those passwords do not match." };
  if (limited(`reset:${token.slice(0, 16)}`, 8, 15 * 60 * 1000)) return { error: "Too many attempts. Wait a few minutes." };

  const result = await mutate((store) => {
    const user = store.users.find(
      (item) =>
        item.resetTokenHash &&
        item.resetExpiresAt &&
        new Date(item.resetExpiresAt).getTime() > Date.now() &&
        tokensMatch(token, item.resetTokenHash),
    );
    if (!user) return { ok: false as const, error: "This reset link is invalid or expired." };
    user.passwordHash = hashPassword(password);
    user.resetTokenHash = null;
    user.resetExpiresAt = null;
    user.mustChangePassword = false;
    return { ok: true as const, userId: user.id };
  });
  if (!result.ok) return { error: result.error };
  const user = findUser(getStore(), result.userId);
  if (!user) return { error: "Try the link again." };
  await setSessionCookie(createSessionToken(user));
  redirect(user.role === "admin" ? "/admin" : "/portal?notice=password-changed");
}

export async function sendMessage(_prev: { error: string }, formData: FormData): Promise<{ error: string }> {
  if (oneLine(formData.get("company_website"), 200)) redirect("/contact?sent=1");
  const address = await clientAddress();
  if (limited(`contact:${address}`, 5, 60 * 60 * 1000)) {
    return { error: "Too many notes from this network. Email the studio directly." };
  }
  const name = oneLine(formData.get("name"), 80);
  const email = oneLine(formData.get("email"), 160).toLowerCase();
  const company = oneLine(formData.get("company"), 120);
  const budget = oneLine(formData.get("budget"), 80);
  const timeline = oneLine(formData.get("timeline"), 80);
  const service = oneLine(formData.get("service"), 80);
  const message = clip(formData.get("message"), 5000);
  if (!name || !emailOk(email) || message.length < 10) {
    return { error: "Add your name, a real email, and a short note about the work." };
  }
  await mutate((store) => {
    store.messages.unshift({
      id: newId("msg"),
      name,
      email,
      company,
      budget,
      timeline,
      service,
      message,
      createdAt: new Date().toISOString(),
      readAt: null,
    });
    logEvent(store, `New inquiry from ${name}.`, "/admin/messages");
  });
  redirect("/contact?sent=1");
}

export async function createInvite(_prev: { error: string }, formData: FormData): Promise<{ error: string }> {
  await requireAdmin();
  const name = oneLine(formData.get("name"), 80);
  const email = oneLine(formData.get("email"), 160).toLowerCase();
  const company = oneLine(formData.get("company"), 120);
  const siteName = oneLine(formData.get("siteName"), 120);
  const hostingLabel = oneLine(formData.get("hostingLabel"), 120);
  const clientNote = clip(formData.get("clientNote"), 1000);
  const days = Number(oneLine(formData.get("days"), 3));
  const cents = dollarsToCents(oneLine(formData.get("amount"), 20));
  if (!name || !emailOk(email) || !siteName || !hostingLabel) {
    return { error: "Name, email, site, and plan name are required." };
  }
  if (cents === null || cents < 100 || cents > 10_000_000) {
    return { error: "Enter a monthly amount between $1 and $100,000." };
  }
  if (![7, 14, 30, 60].includes(days)) return { error: "Choose how long the link stays valid." };

  const result = await mutate((store) => {
    if (findUserByEmail(store, email)) return { ok: false as const, error: "That email already has an account." };
    const pending = store.invites.find(
      (invite) =>
        invite.email === email && !invite.acceptedAt && !invite.revokedAt && new Date(invite.expiresAt).getTime() > Date.now(),
    );
    if (pending) return { ok: false as const, error: "A live invite already exists for that email. Revoke it before sending another." };
    const now = new Date();
    const invite: Invite = {
      id: newId("ivt"),
      token: randomToken(24),
      email,
      name,
      company,
      siteName,
      hostingLabel,
      monthlyAmountCents: cents,
      clientNote,
      expiresAt: new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now.toISOString(),
      revokedAt: null,
      acceptedAt: null,
      acceptedUserId: null,
    };
    store.invites.unshift(invite);
    logEvent(store, `Invite created for ${name}, ${siteName}.`, "/admin/invites");
    return { ok: true as const, id: invite.id };
  });
  if (!result.ok) return { error: result.error };
  redirect(`/admin/invites?created=${result.id}`);
}

export async function revokeInvite(formData: FormData) {
  await requireAdmin();
  const id = oneLine(formData.get("id"), 80);
  await mutate((store) => {
    const invite = store.invites.find((item) => item.id === id);
    if (!invite || invite.acceptedAt) return;
    invite.revokedAt = new Date().toISOString();
    logEvent(store, `Invite revoked for ${invite.email}.`, "/admin/invites");
  });
  redirectNotice("/admin/invites", "invite-revoked");
}

export async function updateMonthlyAmount(formData: FormData) {
  await requireAdmin();
  const userId = oneLine(formData.get("userId"), 80);
  const cents = dollarsToCents(oneLine(formData.get("amount"), 20));
  if (cents === null || cents < 100 || cents > 10_000_000) redirectNotice(`/admin/clients/${userId}`, "amount-invalid");
  const existing = subscriptionFor(getStore(), userId);
  if (!existing) redirectNotice("/admin/clients", "missing");
  if (existing.processor === "stripe" && existing.stripeSubscriptionId) {
    try {
      await updateStripeAmount(existing, cents);
    } catch (error) {
      console.error(error);
      redirectNotice(`/admin/clients/${userId}`, "stripe-amount-failed");
    }
  }
  await mutate((store) => {
    const sub = subscriptionFor(store, userId);
    if (!sub) return;
    sub.monthlyAmountCents = cents;
    sub.updatedAt = new Date().toISOString();
    logEvent(store, `Monthly rate for ${sub.siteName} updated for the next charge.`, `/admin/clients/${userId}`);
  });
  redirectNotice(`/admin/clients/${userId}`, "amount-saved");
}

export async function updateClientDetails(formData: FormData) {
  await requireAdmin();
  const userId = oneLine(formData.get("userId"), 80);
  const siteName = oneLine(formData.get("siteName"), 120);
  const hostingLabel = oneLine(formData.get("hostingLabel"), 120);
  const adminNote = clip(formData.get("adminNote"), 2000);
  if (!siteName || !hostingLabel) redirectNotice(`/admin/clients/${userId}`, "details-invalid");
  await mutate((store) => {
    const sub = subscriptionFor(store, userId);
    if (!sub) return;
    sub.siteName = siteName;
    sub.hostingLabel = hostingLabel;
    sub.adminNote = adminNote;
    sub.updatedAt = new Date().toISOString();
  });
  redirectNotice(`/admin/clients/${userId}`, "details-saved");
}

export async function pauseSubscription(formData: FormData) {
  await requireAdmin();
  const userId = oneLine(formData.get("userId"), 80);
  const existing = subscriptionFor(getStore(), userId);
  if (!existing) redirectNotice("/admin/clients", "missing");
  const pausing = existing.status !== "paused";
  if (existing.processor === "stripe" && existing.stripeSubscriptionId) {
    try {
      await setStripePause(existing, pausing);
    } catch (error) {
      console.error(error);
      redirectNotice(`/admin/clients/${userId}`, "stripe-error");
    }
  }
  await mutate((store) => {
    const sub = subscriptionFor(store, userId);
    if (!sub) return;
    if (pausing) {
      sub.status = "paused";
      sub.autopay = false;
    } else {
      sub.status = sub.paymentMethod ? "active" : "awaiting_payment";
      sub.autopay = Boolean(sub.paymentMethod);
      if (sub.paymentMethod && sub.processor === "demo") {
        sub.nextBillAt = addMonths(new Date().toISOString(), 1);
      }
    }
    sub.updatedAt = new Date().toISOString();
    logEvent(store, `${sub.siteName} hosting ${pausing ? "paused" : "resumed"}.`, `/admin/clients/${userId}`);
  });
  redirectNotice(`/admin/clients/${userId}`, pausing ? "paused" : "resumed");
}

export async function cancelSubscriptionNow(formData: FormData) {
  await requireAdmin();
  const userId = oneLine(formData.get("userId"), 80);
  const existing = subscriptionFor(getStore(), userId);
  if (!existing) redirectNotice("/admin/clients", "missing");
  if (existing.processor === "stripe" && existing.stripeSubscriptionId) {
    try {
      await setStripeCancel(existing, false, true);
    } catch (error) {
      console.error(error);
      redirectNotice(`/admin/clients/${userId}`, "stripe-error");
    }
  }
  await mutate((store) => {
    const sub = subscriptionFor(store, userId);
    if (!sub) return;
    sub.status = "canceled";
    sub.autopay = false;
    sub.nextBillAt = null;
    sub.canceledAt = new Date().toISOString();
    sub.updatedAt = sub.canceledAt;
    logEvent(store, `${sub.siteName} hosting canceled.`, `/admin/clients/${userId}`);
  });
  redirectNotice(`/admin/clients/${userId}`, "canceled");
}

export async function keepSubscription(formData: FormData) {
  await requireAdmin();
  const userId = oneLine(formData.get("userId"), 80);
  const existing = subscriptionFor(getStore(), userId);
  if (!existing) redirectNotice("/admin/clients", "missing");
  if (existing.processor === "stripe" && existing.stripeSubscriptionId) {
    try {
      await setStripeCancel(existing, false, false);
    } catch (error) {
      console.error(error);
      redirectNotice(`/admin/clients/${userId}`, "stripe-error");
    }
  }
  await mutate((store) => {
    const sub = subscriptionFor(store, userId);
    if (!sub) return;
    sub.cancelAtPeriodEnd = false;
    sub.cancelRequestedAt = null;
    sub.updatedAt = new Date().toISOString();
    logEvent(store, `${sub.siteName} will keep hosting.`, `/admin/clients/${userId}`);
  });
  redirectNotice(`/admin/clients/${userId}`, "cancel-kept");
}

export async function createResetLink(formData: FormData) {
  await requireAdmin();
  const userId = oneLine(formData.get("userId"), 80);
  const token = randomToken(24);
  const found = await mutate((store) => {
    const user = findUser(store, userId);
    if (!user || user.role !== "customer") return false;
    user.resetTokenHash = hashToken(token);
    user.resetExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    logEvent(store, `Password reset link created for ${user.email}.`, `/admin/clients/${userId}`);
    return true;
  });
  if (!found) redirectNotice("/admin/clients", "missing");
  redirect(`/admin/clients/${userId}?notice=reset-ready&token=${encodeURIComponent(token)}`);
}

export async function updateProfile(formData: FormData) {
  await requireAdmin();
  const studioName = oneLine(formData.get("studioName"), 80);
  const legalName = oneLine(formData.get("legalName"), 120);
  const supportEmail = oneLine(formData.get("supportEmail"), 160).toLowerCase();
  const phone = oneLine(formData.get("phone"), 40);
  const location = oneLine(formData.get("location"), 80);
  const tagline = oneLine(formData.get("tagline"), 140);
  if (!studioName || !legalName || !emailOk(supportEmail)) redirectNotice("/admin/settings", "profile-invalid");
  await mutate((store) => {
    store.settings.studioName = studioName;
    store.settings.legalName = legalName;
    store.settings.supportEmail = supportEmail;
    store.settings.phone = phone;
    store.settings.location = location;
    store.settings.tagline = tagline;
  });
  redirectNotice("/admin/settings", "profile-saved");
}

export async function updateAdminEmail(formData: FormData) {
  const admin = await requireAdmin();
  const email = oneLine(formData.get("email"), 160).toLowerCase();
  const password = String(formData.get("password") || "");
  if (!emailOk(email)) redirectNotice("/admin/settings", "profile-invalid");
  const full = findUser(getStore(), admin.id);
  if (!full || !verifyPassword(password, full.passwordHash)) redirectNotice("/admin/settings", "password-wrong");
  const taken = await mutate((store) => {
    if (store.users.some((user) => user.email === email && user.id !== admin.id)) return true;
    const row = findUser(store, admin.id);
    if (row) row.email = email;
    return false;
  });
  if (taken) redirectNotice("/admin/settings", "email-taken");
  redirectNotice("/admin/settings", "email-saved");
}

export async function markMessageRead(id: string) {
  await requireAdmin();
  await mutate((store) => {
    const message = store.messages.find((item) => item.id === id);
    if (message && !message.readAt) message.readAt = new Date().toISOString();
  });
}

export async function runBillingNow() {
  await requireAdmin();
  const count = await syncBilling();
  redirectNotice("/admin", count > 0 ? "billed" : "nothing-due");
}
