import Link from "next/link"

export const Footer = () => {
    return (
        <footer className="w-screen mt-4 border-t bg-neutral-900">
            <div className="flex items-center justify-between w-full gap-6 py-6 mx-auto max-w-screen-2xl">
                <p className="text-sm font-medium">
                    &copy; Netflix Clone, Next 14 2024. Created by <Link href="https://github.com/yankes404" target="_blank"><span className="text-red-500 hover:underline">yankes404</span></Link>
                </p>
                <div className="flex items-center text-sm gap-x-3 text-muted-foreground">
                    <Link
                        href="https://github.com/yankes404/netflix-clone-nextjs"
                        target="_blank"
                        className="hover:underline"
                    >
                        Github Repository
                    </Link>
                </div>
            </div>
        </footer>
    )
}