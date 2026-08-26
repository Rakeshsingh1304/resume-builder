export interface PricingPlan {
    price: number;
    currency: string; // ISO code, e.g. "INR" or "USD"
    displayPrice: string; // e.g. "₹149" or "$7"
}

// Fixed prices per region — these are deliberately CHOSEN price points,
// not just an auto currency-converted amount. This is a common SaaS
// strategy (Netflix, Spotify, etc. price differently per country based on
// local purchasing power, not a 1:1 currency conversion).
//
// To add/change a region: just add or edit an entry here.
const PRICING_TABLE: Record<string, PricingPlan> = {
    DEFAULT: { price: 149, currency: "INR", displayPrice: "₹149" },
    US: { price: 7, currency: "USD", displayPrice: "$7" },
};

/**
 * Best-effort region detection using the browser's language/locale setting
 * (e.g. "en-IN" → India, "en-US" → United States).
 *
 * This is a simple, free, no-dependency heuristic for DISPLAY purposes —
 * it is NOT 100% accurate (e.g. someone could have their browser set to a
 * different language than their actual country). That's fine here: once a
 * real payment gateway is wired up, the actual currency charged will be
 * based on the gateway's own checkout (which uses the card/account details),
 * not on this client-side guess.
 *
 * Only call this in the browser (client components) — it uses `navigator`.
 */
export function detectUserRegion(): string {
    if (typeof navigator === "undefined") return "DEFAULT";
    const locale = navigator.language || "en-US"; // e.g. "en-IN", "en-US", "fr-FR"
    const parts = locale.split("-");
    const region = parts.length > 1 ? parts[1].toUpperCase() : "";
    return region === "IN" ? "IN" : "DEFAULT";
}

export function getPricingPlan(): PricingPlan {
    const region = detectUserRegion();
    return PRICING_TABLE[region] || PRICING_TABLE.DEFAULT;
}

// Safe default to use for the very first render (before we know the
// browser's locale) so server-rendered and client-rendered HTML match.
export const DEFAULT_PRICING_PLAN = PRICING_TABLE.DEFAULT;