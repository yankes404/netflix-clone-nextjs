import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface Props {
    message?: string | null;
}

export const ErrorMessage = ({ message }: Props) => {
    if (!message) return null;

    return (
        <div className="p-2.5 gap-1.5 rounded-lg bg-destructive/15 text-destructive flex items-center text-xs">
            <ExclamationTriangleIcon className="size-3 shrink-0" />
            {message}
        </div>
    )
}