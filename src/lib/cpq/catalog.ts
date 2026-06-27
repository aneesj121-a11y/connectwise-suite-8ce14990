// ============================================================
// Global CPQ catalog — products, bundles, addons, term/volume bands
// ============================================================
export type ProductFamily = "Platform" | "AI" | "Telephony" | "Services" | "Addon";

export type Product = {
  sku: string;
  name: string;
  family: ProductFamily;
  unit: "Seat" | "Minute" | "Account" | "One-time" | "GB";
  listPrice: number;       // per-unit, per-month for recurring; flat for one-time
  recurring: boolean;
  description: string;
  // soft-cap discount the deal-desk allows without approval
  maxAutoDiscountPct: number;
  // hard floor — below this the system blocks the quote
  floorDiscountPct: number;
};

export const CATALOG: Product[] = [
  // Core platform
  { sku: "LMN-CORE-SEAT",    name: "Limnn Core — Seat",        family: "Platform", unit: "Seat",     listPrice: 79,    recurring: true,  description: "Per-seat platform license, dialer + CRM core.",        maxAutoDiscountPct: 15, floorDiscountPct: 30 },
  { sku: "LMN-PRO-SEAT",     name: "Limnn Pro — Seat",         family: "Platform", unit: "Seat",     listPrice: 129,   recurring: true,  description: "Pro tier — AI coach, advanced reporting, CPQ.",        maxAutoDiscountPct: 15, floorDiscountPct: 30 },
  { sku: "LMN-ENT-SEAT",     name: "Limnn Enterprise — Seat",  family: "Platform", unit: "Seat",     listPrice: 199,   recurring: true,  description: "SSO, audit, custom data residency, premium SLA.",      maxAutoDiscountPct: 12, floorDiscountPct: 25 },

  // AI
  { sku: "LMN-AI-MIN",       name: "AI Transcription Minutes", family: "AI",       unit: "Minute",   listPrice: 0.015, recurring: true,  description: "Live transcription + post-call summaries.",            maxAutoDiscountPct: 20, floorDiscountPct: 40 },
  { sku: "LMN-AI-COACH",     name: "Limnn AI Coach",           family: "AI",       unit: "Seat",     listPrice: 35,    recurring: true,  description: "Real-time objection battlecards + scoring.",           maxAutoDiscountPct: 15, floorDiscountPct: 30 },
  { sku: "LMN-AI-INTENT",    name: "Intent Signals",           family: "AI",       unit: "Account",  listPrice: 4,     recurring: true,  description: "Account-level 3rd-party intent feed.",                 maxAutoDiscountPct: 15, floorDiscountPct: 25 },

  // Telephony
  { sku: "LMN-DID-LOCAL",    name: "Local Numbers (DID)",      family: "Telephony",unit: "Seat",     listPrice: 6,     recurring: true,  description: "Local-presence number pool per seat.",                 maxAutoDiscountPct: 10, floorDiscountPct: 20 },
  { sku: "LMN-DID-TFN",      name: "Toll-free Numbers",        family: "Telephony",unit: "Account",  listPrice: 22,    recurring: true,  description: "Inbound toll-free with smart routing.",                maxAutoDiscountPct: 10, floorDiscountPct: 20 },
  { sku: "LMN-REC-STORE",    name: "Call Recording Storage",   family: "Telephony",unit: "GB",       listPrice: 0.12,  recurring: true,  description: "Encrypted retention, configurable per region.",        maxAutoDiscountPct: 20, floorDiscountPct: 35 },

  // Services / one-time
  { sku: "LMN-PS-ONB",       name: "Premium Onboarding",       family: "Services", unit: "One-time", listPrice: 9500,  recurring: false, description: "6-week implementation with a named architect.",       maxAutoDiscountPct: 10, floorDiscountPct: 25 },
  { sku: "LMN-PS-MIG",       name: "Data Migration Pack",      family: "Services", unit: "One-time", listPrice: 4500,  recurring: false, description: "Up to 1M records from legacy CRM.",                    maxAutoDiscountPct: 10, floorDiscountPct: 25 },
  { sku: "LMN-PS-TRAIN",     name: "Manager Enablement Day",   family: "Services", unit: "One-time", listPrice: 2800,  recurring: false, description: "Onsite manager + ops enablement.",                     maxAutoDiscountPct: 15, floorDiscountPct: 30 },

  // Addons
  { sku: "LMN-ADD-COMP",     name: "Compliance Pack (HIPAA/PCI)", family: "Addon", unit: "Account",  listPrice: 1500,  recurring: true,  description: "BAA, redaction, retention controls.",                  maxAutoDiscountPct: 10, floorDiscountPct: 20 },
  { sku: "LMN-ADD-DATA",     name: "Data Residency — EU/UK",   family: "Addon",    unit: "Account",  listPrice: 800,   recurring: true,  description: "EU-only processing & storage.",                        maxAutoDiscountPct: 10, floorDiscountPct: 15 },
  { sku: "LMN-ADD-SSO",      name: "Premium SSO + SCIM",       family: "Addon",    unit: "Account",  listPrice: 600,   recurring: true,  description: "Okta/Azure SSO, SCIM provisioning.",                   maxAutoDiscountPct: 10, floorDiscountPct: 20 },
];

export type Bundle = {
  id: string;
  name: string;
  description: string;
  items: { sku: string; qty: number; termMonths: number; discountPct?: number }[];
  bundleDiscountPct: number;
};

export const BUNDLES: Bundle[] = [
  {
    id: "bundle-starter",
    name: "Starter — 10 seats",
    description: "Limnn Pro + AI Coach + onboarding for a 10-seat team.",
    bundleDiscountPct: 5,
    items: [
      { sku: "LMN-PRO-SEAT", qty: 10, termMonths: 12 },
      { sku: "LMN-AI-COACH", qty: 10, termMonths: 12 },
      { sku: "LMN-AI-MIN", qty: 50000, termMonths: 12 },
      { sku: "LMN-PS-ONB", qty: 1, termMonths: 0 },
    ],
  },
  {
    id: "bundle-growth",
    name: "Growth — 25 seats",
    description: "Pro + AI Coach + telephony + onboarding for fast-growth sales.",
    bundleDiscountPct: 10,
    items: [
      { sku: "LMN-PRO-SEAT", qty: 25, termMonths: 12 },
      { sku: "LMN-AI-COACH", qty: 25, termMonths: 12 },
      { sku: "LMN-AI-MIN", qty: 150000, termMonths: 12 },
      { sku: "LMN-DID-LOCAL", qty: 25, termMonths: 12 },
      { sku: "LMN-PS-ONB", qty: 1, termMonths: 0 },
    ],
  },
  {
    id: "bundle-enterprise",
    name: "Enterprise — 100 seats",
    description: "Enterprise tier with full compliance, SSO, residency, and pro services.",
    bundleDiscountPct: 15,
    items: [
      { sku: "LMN-ENT-SEAT", qty: 100, termMonths: 24 },
      { sku: "LMN-AI-COACH", qty: 100, termMonths: 24 },
      { sku: "LMN-AI-MIN", qty: 600000, termMonths: 12 },
      { sku: "LMN-DID-LOCAL", qty: 100, termMonths: 12 },
      { sku: "LMN-ADD-COMP", qty: 1, termMonths: 12 },
      { sku: "LMN-ADD-SSO", qty: 1, termMonths: 12 },
      { sku: "LMN-PS-ONB", qty: 1, termMonths: 0 },
      { sku: "LMN-PS-MIG", qty: 1, termMonths: 0 },
    ],
  },
];

export const findProduct = (sku: string) => CATALOG.find((p) => p.sku === sku);
