import "server-only";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import path from "path";
import { studioDefaults } from "./content";
import { hashPassword, newId, randomToken } from "./passwords";
import type { EventLog, Settings, StoreData, User } from "./types";

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "store.json");
const secretPath = path.join(dataDir, "session-secret");
const passwordPath = path.join(dataDir, "generated-admin-password.txt");

let chain: Promise<unknown> = Promise.resolve();

function settingsSeed(): Settings {
  return {
    studioName: studioDefaults.name,
    legalName: studioDefaults.legalName,
    supportEmail: studioDefaults.email,
    phone: studioDefaults.phone,
    location: studioDefaults.location,
    tagline: studioDefaults.tagline,
    nextInvoice: 1001,
  };
}

function emptyStore(): StoreData {
  return {
    users: [],
    invites: [],
    subscriptions: [],
    invoices: [],
    messages: [],
    events: [],
    settings: settingsSeed(),
  };
}

function writeStore(store: StoreData) {
  mkdirSync(dataDir, { recursive: true });
  const tmp = `${storePath}.tmp`;
  writeFileSync(tmp, JSON.stringify(store, null, 2));
  renameSync(tmp, storePath);
}

function createAdmin(email: string, password: string, mustChangePassword: boolean): User {
  const now = new Date().toISOString();
  return {
    id: "usr_admin",
    email: email.toLowerCase(),
    name: "Studio admin",
    company: studioDefaults.name,
    passwordHash: hashPassword(password),
    role: "admin",
    createdAt: now,
    acceptedTermsAt: now,
    resetTokenHash: null,
    resetExpiresAt: null,
    stripeCustomerId: null,
    mustChangePassword,
  };
}

function ensureStore() {
  mkdirSync(dataDir, { recursive: true });
  if (existsSync(storePath)) return;
  const email = (process.env.ADMIN_EMAIL || "admin@murleydigital.com").toLowerCase();
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  const password = fromEnv || randomToken(12);
  const mustChange = !fromEnv;
  if (!fromEnv) {
    writeFileSync(
      passwordPath,
      `Murley Digital admin\nEmail: ${email}\nPassword: ${password}\n\nChange this after you sign in. Settings is in the desk.\n`,
      { mode: 0o600 },
    );
    console.log(`\nMurley Digital admin created\nEmail: ${email}\nPassword file: data/generated-admin-password.txt\n`);
  }
  const store = emptyStore();
  store.users.push(createAdmin(email, password, mustChange));
  store.events.push({
    id: newId("evt"),
    at: new Date().toISOString(),
    message: "Desk ready. Invite a client when a site is ready to host.",
    href: "/admin/invites",
  });
  writeStore(store);
}

export function getStore(): StoreData {
  ensureStore();
  const raw = readFileSync(storePath, "utf8");
  return JSON.parse(raw) as StoreData;
}

export function mutate<T>(fn: (store: StoreData) => T): Promise<T> {
  const run = chain.then(() => {
    const store = getStore();
    const result = fn(store);
    writeStore(store);
    return result;
  });
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function mutateAsync<T>(fn: (store: StoreData) => Promise<T>): Promise<T> {
  const run = chain.then(async () => {
    const store = getStore();
    const result = await fn(store);
    writeStore(store);
    return result;
  });
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function logEvent(store: StoreData, message: string, href?: string) {
  const event: EventLog = { id: newId("evt"), at: new Date().toISOString(), message, href };
  store.events.unshift(event);
  store.events = store.events.slice(0, 200);
}

export function getSessionSecret() {
  if (process.env.SESSION_SECRET?.trim()) return process.env.SESSION_SECRET.trim();
  mkdirSync(dataDir, { recursive: true });
  if (existsSync(secretPath)) return readFileSync(secretPath, "utf8").trim();
  const secret = randomToken(32);
  writeFileSync(secretPath, secret, { mode: 0o600 });
  return secret;
}

export function getProfile() {
  const settings = getStore().settings;
  return {
    name: settings.studioName,
    legalName: settings.legalName,
    email: settings.supportEmail,
    phone: settings.phone,
    location: settings.location,
    tagline: settings.tagline,
  };
}

export function findUserByEmail(store: StoreData, email: string) {
  const needle = email.toLowerCase();
  return store.users.find((user) => user.email === needle) || null;
}

export function findUser(store: StoreData, id: string) {
  return store.users.find((user) => user.id === id) || null;
}
