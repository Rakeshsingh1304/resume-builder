const API_URL = "http://localhost:3001";

export async function apiFetch(
    path: string,
    token: string | null,
    options: RequestInit = {}
) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Request failed: ${res.status}`);
    }

    return res.json();
}