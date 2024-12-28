"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { EditUserPasswordForm } from "./edit-user-password-form";

interface Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const EditUserPasswordModal = ({
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
                    Password
                </DialogTitle>
                <DialogDescription>
                    Change your password
                </DialogDescription>
            </DialogHeader>
            <EditUserPasswordForm
                onSuccess={onSuccess}
            />
        </ResponsiveModal>
    )
}