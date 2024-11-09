"use client";

import { toast } from "sonner";

interface Props {
    value: string;
    disabled?: boolean;
}

export const CopyValueButton = ({
    value,
    disabled
}: Props) => {
    const onClick = () => {
        try {
            navigator.clipboard.writeText(value);
            toast.success("Copied to clipboard");
        } catch {
            toast.error("Failed to copy")
        }
    }

    return (
        <button
            onClick={onClick}
            className="h-7 text-sm font-medium font-mono text-neutral-300 bg-neutral-800 p-1 rounded max-w-64 truncate transition hover:bg-neutral-700 disabled:pointer-events-none"
            disabled={disabled}
        >
            {value}
        </button>
    )
}