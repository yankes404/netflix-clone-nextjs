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
            className="p-1 font-mono text-sm font-medium truncate transition rounded h-7 text-neutral-300 bg-neutral-800 max-w-64 hover:bg-neutral-700 disabled:pointer-events-none"
            disabled={disabled}
        >
            {value}
        </button>
    )
}