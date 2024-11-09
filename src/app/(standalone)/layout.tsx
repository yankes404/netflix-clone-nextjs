import { StandaloneHeader } from "@/components/standalone-header";

interface Props {
    children: React.ReactNode;
}

const StandaloneLayout = ({ children }: Props) => {
    return (
        <div className="h-screen w-full max-w-screen-2xl mx-auto px-4">
            <StandaloneHeader />
            {children}
        </div>
    )
}
 
export default StandaloneLayout;