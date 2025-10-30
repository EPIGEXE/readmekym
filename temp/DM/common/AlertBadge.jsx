export const AlertBadge = ({ color, label }) => {
    return (
        <span
            className="flex items-center px-1.5 py-0.5 rounded-full border border-white"
            style={{ backgroundColor: color }}
        >
            <span className="text-xs text-white font-semibold">{label}</span>
        </span>
    );
};

export const CheckedBadge = ({ color, label }) => {
    return (
        <span
            className="flex items-center px-1.5 py-0.5 rounded-full border border-white"
            style={{ backgroundColor: color }}
        >
            <span className="text-xs text-white font-semibold">{label}</span>
        </span>
    );
};

export const AutoCheckedBadge = ({ color, label }) => {
    return (
        <span
            className="flex items-center px-1.5 py-0.5 rounded-full border border-white"
            style={{ backgroundColor: color }}
        >
            <span className="text-xs text-white font-semibold">{label}</span>
        </span>
    );
};
