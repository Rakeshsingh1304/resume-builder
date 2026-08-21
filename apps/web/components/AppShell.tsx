"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";

const baseNavItems = [
    { label: "My Resumes", href: "/dashboard" },
    { label: "Cover Letters", href: "/cover-letters" },
];

const adminNavItem = { label: "Admin", href: "/admin" };

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { getToken } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function checkRole() {
            try {
                const token = await getToken();
                const me = await apiFetch("/api/users/me", token);
                setIsAdmin(me.role === "ADMIN");
            } catch {
                // If this fails for any reason, just don't show the Admin link
                setIsAdmin(false);
            }
        }
        checkRole();
    }, []);

    const navItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;

    return (
        <div className="flex h-screen">
            {/* Mobile Top Bar (visible only on small screens) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[var(--sidebar)] text-white flex items-center justify-between px-4 z-30">
                <h1 className="font-heading text-lg font-bold">ResumeAI</h1>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-white p-2"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Overlay behind mobile menu */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-20"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar: hidden by default on mobile, slides in when open. Always visible on md+ */}
            <aside
                className={`
          w-64 flex-shrink-0 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col
          fixed md:sticky top-0 h-screen z-30 transition-transform duration-200
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
            >
                <div className="p-6 hidden md:block">
                    <h1 className="font-heading text-xl font-bold text-white">ResumeAI</h1>
                </div>
                <div className="h-14 md:hidden" /> {/* Spacer to align with mobile top bar */}

                <nav className="flex-1 px-3 space-y-1 mt-2 md:mt-0">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded text-sm transition ${isActive
                                    ? "bg-[var(--sidebar-accent)] text-white font-medium"
                                    : "text-[var(--sidebar-foreground)] opacity-80 hover:opacity-100 hover:bg-[var(--sidebar-accent)]"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[var(--sidebar-border)] flex items-center gap-2">
                    <UserButton />
                    <span className="text-sm opacity-80">Account</span>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-screen bg-[var(--background)] overflow-y-auto pt-14 md:pt-0 w-full md:w-auto">
                {children}
            </main>
        </div>
    );
}