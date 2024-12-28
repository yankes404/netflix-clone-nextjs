import { StandaloneHeader } from "@/components/standalone-header";

interface Props {
    children: React.ReactNode;
}

const StandaloneLayout = ({ children }: Props) => {
    return (
        <div className="w-full h-screen px-4 mx-auto max-w-screen-2xl">
            <StandaloneHeader />
            {children}
        </div>
    )
}
 
export default StandaloneLayout;