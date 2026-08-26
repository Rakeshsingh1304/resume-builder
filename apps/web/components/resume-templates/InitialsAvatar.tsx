interface InitialsAvatarProps {
    fullName?: string;
    photoUrl?: string;
    size?: number;
    bgColor?: string;
    textColor?: string;
}

function getInitials(fullName?: string): string {
    if (!fullName || !fullName.trim()) return "?";
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
}

// Shows the user's uploaded photo if available; otherwise falls back to a
// circle with their initials.
export default function InitialsAvatar({
    fullName,
    photoUrl,
    size = 64,
    bgColor = "#E3A008",
    textColor = "#14213D",
}: InitialsAvatarProps) {
    if (photoUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={photoUrl}
                alt={fullName || "Profile photo"}
                className="rounded-full object-cover shrink-0"
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <div
            className="rounded-full flex items-center justify-center font-bold shrink-0"
            style={{
                width: size,
                height: size,
                backgroundColor: bgColor,
                color: textColor,
                fontSize: size * 0.36,
            }}
        >
            {getInitials(fullName)}
        </div>
    );
}