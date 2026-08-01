"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function DashboardPage() {
    const { getToken } = useAuth();
    const [result, setResult] = useState<string>("");

    async function testBackend() {
        const token = await getToken();

        const res = await fetch("http://localhost:3001/api/test-protected", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        setResult(JSON.stringify(data, null, 2));
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <button
                onClick={testBackend}
                className="bg-black text-white px-4 py-2 rounded"
            >
                Test Backend Connection
            </button>
            <pre className="mt-4 bg-gray-100 p-4 rounded">{result}</pre>
        </div>
    );
}