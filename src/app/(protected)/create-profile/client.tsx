import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateProfileForm } from "@/features/profiles/components/create-profile-form"

export const CreateProfileClient = () => {
    return (
        <div className="w-screen h-screen p-4 flex flex-col justify-center items-center">
            <CreateProfileForm />
        </div>
    )
}