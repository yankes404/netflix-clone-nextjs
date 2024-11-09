import { PenIcon } from "lucide-react";
import { CopyValueButton } from "./copy-value-button";
import { Button } from "./ui/button";
import { SettingField } from "./setting-field";

interface Props {
    label: string;
    value: string;
    disabled?: boolean;
    canEdit?: boolean;
    onEditOpen?: () => void;
}

export const SettingValue = ({
    label,
    value,
    disabled,
    canEdit,
    onEditOpen
}: Props) => {
    return (
        <SettingField label={label}>
            <div className="flex gap-1">
                <CopyValueButton
                    value={value}
                    disabled={disabled}
                />
                {canEdit && (
                    <Button
                        size="icon"
                        variant="secondary"
                        className="size-7 rounded"
                        onClick={onEditOpen}
                    >
                        <PenIcon className="!size-3" />
                    </Button>
                )}
            </div>
        </SettingField>
    )
}