import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface Props {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: Props) => {
    return (
        <>
            <Header />
            <div className="w-screen min-h-screen pt-24 mx-auto max-w-screen-2xl">
                {children}
            </div>
            <Footer />
        </>
    )
}
 
export default ProtectedLayout;