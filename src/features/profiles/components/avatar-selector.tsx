import Image from "next/image"

import { cn } from "@/lib/utils";

import { ProfileImage } from "../types"

interface AvatarButtonProps {
    value: ProfileImage;
    isSelected?: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export const AvatarButton = ({
    value,
    isSelected,
    onClick,
    disabled
}: AvatarButtonProps) => {
    return (
        <button
            className={cn("rounded-sm disabled:pointer-events-none disabled:opacity-50 transition", isSelected && "border border-white")}
            type="button"
            onClick={onClick}
            disabled={disabled}
        >
            <Image
                src={`/profiles/${value}.webp`}
                alt={`${value} Profile`}
                width={32}
                height={32}
                className="rounded-sm"
            />
        </button>
    )
}

interface Props {
    value: ProfileImage;
    onChange: (value: ProfileImage) => void;
    disabled?: boolean;
}

const images = [
    ProfileImage.RED,
    ProfileImage.BLUE,
    ProfileImage.YELLOW,
    ProfileImage.GREEN,
    ProfileImage.GRAY,
]

export const AvatarSelector = ({
    value,
    onChange,
    disabled
}: Props) => {
    return (
        <div className="flex gap-x-2">
            {images.map((image) => (
                <AvatarButton
                    key={image}
                    value={image}
                    isSelected={value === image}
                    onClick={() => onChange(image)}
                    disabled={disabled}
                />
            ))}
        </div>
    )
}