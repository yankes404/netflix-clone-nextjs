import { cn } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface Props {
    message?: string | null;
    className?: string;
}

export const ErrorMessage = ({
    message,
    className
}: Props) => {
    if (!message) return null;

    return (
        <div className={cn("p-2.5 gap-1.5 rounded-lg bg-destructive/15 text-destructive flex items-center text-xs", className)}>
            <ExclamationTriangleIcon className="size-3 shrink-0" />
            {message}
        </div>
    )
}