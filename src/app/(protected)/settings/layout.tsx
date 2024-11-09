import StandaloneLayout from "@/app/(standalone)/layout";

interface Props {
    children: React.ReactNode;
}

const SettingsLayout = ({ children }: Props) => {
    return (
        <StandaloneLayout>
            <div className="w-full flex flex-col items-center gap-2 mt-6">
                <h1 className="text-2xl font-semibold w-full max-w-[550px] text-center mb-4">
                    Settings
                </h1>
                <div className="w-full max-w-[550px]">
                    {children}
                </div>
            </div>
        </StandaloneLayout>
    )
}
 
export default SettingsLayout;