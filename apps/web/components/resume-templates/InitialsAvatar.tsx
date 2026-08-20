interface InitialsAvatarProps {
    fullName?: string;
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

// A circular avatar showing the person's initials — used as a stand-in for
// a real photo, since photo upload isn't implemented yet.
export default function InitialsAvatar({
    fullName,
    size = 64,
    bgColor = "#E3A008",
    textColor = "#14213D",
}: InitialsAvatarProps) {
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