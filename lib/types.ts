export type Role = "admin" | "customer";
export type Processor = "demo" | "stripe";

export type SubscriptionStatus =
  | "awaiting_payment"
  | "active"
  | "past_due"
  | "paused"
  | "canceled";

export type InvoiceStatus = "paid" | "open" | "void" | "failed";

export type PaymentMethod = {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  name: string;
  postal: string;
  addedAt: string;
  providerId: string | null;
};

export type User = {
  id: string;
  email: string;
  name: string;
  company: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
  acceptedTermsAt: string | null;
  resetTokenHash: string | null;
  resetExpiresAt: string | null;
  stripeCustomerId: string | null;
  mustChangePassword: boolean;
};

export type Invite = {
  id: string;
  token: string;
  email: string;
  name: string;
  company: string;
  siteName: string;
  hostingLabel: string;
  monthlyAmountCents: number;
  clientNote: string;
  expiresAt: string;
  createdAt: string;
  revokedAt: string | null;
  acceptedAt: string | null;
  acceptedUserId: string | null;
};

export type Subscription = {
  id: string;
  userId: string;
  inviteId: string;
  siteName: string;
  hostingLabel: string;
  monthlyAmountCents: number;
  currency: "usd";
  status: SubscriptionStatus;
  processor: Processor;
  paymentMethod: PaymentMethod | null;
  autopay: boolean;
  cancelAtPeriodEnd: boolean;
  cancelRequestedAt: string | null;
  nextBillAt: string | null;
  startedAt: string | null;
  canceledAt: string | null;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
  stripeSubscriptionId: string | null;
  stripePaymentMethodId: string | null;
  lastSyncedAt: string | null;
};

export type Invoice = {
  id: string;
  number: string;
  userId: string;
  subscriptionId: string;
  amountCents: number;
  currency: "usd";
  status: InvoiceStatus;
  description: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  paidAt: string | null;
  brand: string | null;
  last4: string | null;
  stripeInvoiceId: string | null;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  timeline: string;
  service: string;
  message: string;
  createdAt: string;
  readAt: string | null;
};

export type EventLog = {
  id: string;
  at: string;
  message: string;
  href?: string;
};

export type Settings = {
  studioName: string;
  legalName: string;
  supportEmail: string;
  phone: string;
  location: string;
  tagline: string;
  nextInvoice: number;
};

export type StoreData = {
  users: User[];
  invites: Invite[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  messages: Message[];
  events: EventLog[];
  settings: Settings;
};

export type Profile = {
  name: string;
  legalName: string;
  email: string;
  phone: string;
  location: string;
  tagline: string;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  company: string;
  role: Role;
  mustChangePassword: boolean;
};
