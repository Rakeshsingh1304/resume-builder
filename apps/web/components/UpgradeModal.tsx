"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import { X, CheckCircle2, Loader2, Crown } from "lucide-react";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgraded: () => void; // called after "payment" succeeds, so the caller can continue (e.g. proceed with download)
}

export default function UpgradeModal({ isOpen, onClose, onUpgraded }: UpgradeModalProps) {
    const { getToken } = useAuth();
    const [processing, setProcessing] = useState(false);

    if (!isOpen) return null;

    async function handleDemoPay() {
        setProcessing(true);
        try {
            const token = await getToken();
            await apiFetch("/api/payments/demo-checkout", token, { method: "POST" });
            onUpgraded();
            onClose();
        } catch (err: any) {
            alert(err.message || "Payment failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
                    title="Close"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-2 mb-1">
                    <Crown size={20} className="text-primary" />
                    <h2 className="font-heading text-xl font-bold text-foreground">Upgrade to Pro</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                    Downloading and printing your resume as a PDF requires a Pro subscription.
                </p>

                <div className="border border-border rounded-lg p-5 mb-6 bg-background">
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className="font-heading text-3xl font-bold text-foreground">₹149</span>
                        <span className="text-sm text-muted-foreground">/ month</span>
                    </div>
                    <ul className="space-y-2.5 text-sm text-foreground">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-primary shrink-0" />
                            Unlimited PDF downloads &amp; printing
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-primary shrink-0" />
                            Unlimited AI generations (no monthly cap)
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-primary shrink-0" />
                            All resume templates
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-primary shrink-0" />
                            Cancel anytime
                        </li>
                    </ul>
                </div>

                <button
                    onClick={handleDemoPay}
                    disabled={processing}
                    className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {processing ? (
                        <>
                            <Loader2 size={16} className="animate-spin" /> Processing...
                        </>
                    ) : (
                        "Pay ₹149 & Upgrade (Demo)"
                    )}
                </button>
                <p className="text-[11px] text-muted-foreground text-center mt-3">
                    Demo mode — no real payment will be charged.
                </p>
            </div>
        </div>
    );
}