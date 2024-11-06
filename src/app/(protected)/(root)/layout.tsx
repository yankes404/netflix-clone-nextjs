import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface Props {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: Props) => {
    return (
        <>
            <Header />
            <div className="w-screen max-w-screen-2xl mx-auto pt-24 min-h-screen">
                {children}
            </div>
            <Footer />
        </>
    )
}
 
export default ProtectedLayout;