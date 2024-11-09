import StandaloneLayout from "../(standalone)/layout";

interface Props {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
    return (
        <StandaloneLayout>
            {children}
        </StandaloneLayout>
    )
}
 
export default AuthLayout;