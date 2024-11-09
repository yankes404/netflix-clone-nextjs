"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditUserEmailForm } from "./edit-user-email-form";

interface Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const EditUserEmailModal = ({
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
                    Email Address
                </DialogTitle>
                <DialogDescription>
                    Edit your email address
                </DialogDescription>
            </DialogHeader>
            <EditUserEmailForm
                onSuccess={onSuccess}
            />
        </ResponsiveModal>
    )
}