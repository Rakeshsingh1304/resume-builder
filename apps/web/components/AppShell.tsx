"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const navItems = [
    { label: "My Resumes", href: "/dashboard" },
    { label: "Cover Letters", href: "/cover-letters" },
    { label: "Admin", href: "/admin" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col">
                <div className="p-6">
                    <h1 className="font-heading text-xl font-bold text-white">ResumeAI</h1>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
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
            <main className="flex-1 bg-[var(--background)] overflow-auto">{children}</main>
        </div>
    );
}