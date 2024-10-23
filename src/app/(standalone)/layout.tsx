import Image from "next/image";
import Link from "next/link";

interface Props {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
    return (
        <div className="h-screen w-full max-w-screen-2xl mx-auto px-4">
            <header className="flex items-center justify-center py-8 w-full">
                <Link
                    href="/"
                >
                    <Image
                        src="/full_logo.svg"
                        alt="Netflix"
                        height={56}
                        width={124}
                        className="hidden sm:block"
                    />
                    <Image
                        src="/logo.svg"
                        alt="Netflix"
                        height={48}
                        width={48}
                        className="sm:hidden"
                    />
                </Link>
            </header>
            {children}
        </div>
    )
}
 
export default AuthLayout;