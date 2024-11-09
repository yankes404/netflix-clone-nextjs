"use client";

import { useMedia } from "react-use";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import {
    Drawer,
    DrawerContent
} from "@/components/ui/drawer";

interface Props {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const ResponsiveModal = ({
    children,
    open,
    onOpenChange
}: Props) => {
    const isDesktop = useMedia("(min-width: 1024px)", true);

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-full sm:max-w-lg overflow-y-auto hide-scrollbar max-h-[85vh]">
                    {children}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <div className="overflow-y-auto hide-scrollbar max-h-[85vh] p-6">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
};