"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import { SettingValue } from "@/components/setting-value";
import { EditUserNameModal } from "@/features/settings/components/edit-user-name-modal";
import { EditUserEmailModal } from "@/features/settings/components/edit-user-email-modal";
import { ErrorMessage } from "@/components/error-message";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { EditUserPasswordModal } from "@/features/settings/components/edit-user-password-modal";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { allSettingPages } from "@/features/settings/constants";
import { SettingPageEnum } from "@/features/settings/types";

export const SettingsClient = () => {
    const { data: session } = useSession();

    const [page, setPage] = useQueryState("page", parseAsStringEnum(allSettingPages).withDefault(SettingPageEnum.GENERAL));

    const [isEditUserNameModalOpen, setIsEditUserNameModalOpen] = useState(false);
    const [isEditUserEmailModalOpen, setIsEditUserEmailModalOpen] = useState(false);
    const [isEditUserPasswordModalOpen, setIsEditUserPasswordModalOpen] = useState(false);

    if (!session || !session.user) {
        return (
            <ErrorMessage message="You're not logged in" className="mt-4" />
        )
    }

    const openEditUserNameModal = () => setIsEditUserNameModalOpen(true);
    const openEditUserEmailModal = () => setIsEditUserEmailModalOpen(true);
    const openEditUserPasswordModal = () => setIsEditUserPasswordModalOpen(true);

    return (
        <>
            <EditUserNameModal
                open={isEditUserNameModalOpen}
                onOpenChange={setIsEditUserNameModalOpen}
            />
            <EditUserEmailModal
                open={isEditUserEmailModalOpen}
                onOpenChange={setIsEditUserEmailModalOpen}
            />
            <EditUserPasswordModal
                open={isEditUserPasswordModalOpen}
                onOpenChange={setIsEditUserPasswordModalOpen}
            />
            <Tabs
                value={page}
                onValueChange={(value) => setPage(value as SettingPageEnum)}
                className="w-full"
            >
                <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value={SettingPageEnum.GENERAL}>
                        General
                    </TabsTrigger>
                    <TabsTrigger value={SettingPageEnum.SECURITY}>
                        Security
                    </TabsTrigger>
                    <TabsTrigger value={SettingPageEnum.SUBSCRIPTIONS}>
                        Subscriptions
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                General Settings
                            </CardTitle>
                        </CardHeader>
                        <div className="flex flex-col w-full px-6 pb-6">
                            <SettingValue
                                label="User ID"
                                value={session.user.id}
                            />
                            <SettingValue
                                label="User Name"
                                value={session.user.name}
                                canEdit
                                onEditOpen={openEditUserNameModal}
                            />
                            <SettingValue
                                label="User Email"
                                value={session.user.email}
                                canEdit
                                onEditOpen={openEditUserEmailModal}
                            />
                        </div>
                    </Card>
                </TabsContent>
                <TabsContent value="security">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Security Settings
                            </CardTitle>
                        </CardHeader>
                        <div className="flex flex-col w-full px-6 pb-6">
                            <SettingValue
                                label="Email Verified"
                                value={session.user.emailVerified ? format(session.user.emailVerified, "PPP") : "Not verified"}
                                disabled
                            />
                            <SettingValue
                                label="Password"
                                value="******"
                                disabled
                                canEdit
                                onEditOpen={openEditUserPasswordModal}
                            />
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    )
}