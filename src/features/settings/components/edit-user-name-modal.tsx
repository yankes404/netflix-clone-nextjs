"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditUserNameForm } from "./edit-user-name-form";

interface Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const EditUserNameModal = ({
    open,
    onOpenChange
}: Props) => {
    const onSuccess = () => onOpenChange?.(false);

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogHeader>
                <DialogTitle>
                    User Name
                </DialogTitle>
                <DialogDescription>
                    Edit your user name
                </DialogDescription>
            </DialogHeader>
            <EditUserNameForm
                onSuccess={onSuccess}
            />
        </ResponsiveModal>
    )
}