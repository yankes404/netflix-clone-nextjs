import { CircleCheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface Props {
    name: string;
    price: number;
    features: string[];
    onSubscribe?: () => void;
    disabled?: boolean;
}

export const PlanCard = ({
    name,
    price,
    features,
    onSubscribe,
    disabled
}: Props) => {
    return (
        <div className="w-full lg:w-[325px] p-4 bg-neutral-900 rounded-md">
            <div className="flex flex-col gap-1 pb-3 mb-3 border-b">
                <p className="text-sm font-semibold text-muted-foreground">{name}</p>
                <strong className="text-lg font-bold">
                    ${(price / 100).toLocaleString("en-US")}<span className="text-xs text-muted-foreground">/month</span>
                </strong>
            </div>
            <ul className="flex flex-col gap-1 pb-3 mb-3 border-b">
                {features.map((feature, key) => (
                    <li className="flex items-center text-sm font-medium text-muted-foreground" key={key}>
                        <CircleCheckIcon className="size-3 text-red-500 mr-1.5" />
                        {feature}
                    </li>
                ))}
            </ul>
            <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={onSubscribe}
                disabled={disabled}
            >
                Subscribe for ${(price / 100).toLocaleString("en-US")}
            </Button>
        </div>
    )
}