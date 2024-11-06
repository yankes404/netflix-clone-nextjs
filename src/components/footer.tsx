import Link from "next/link"

export const Footer = () => {
    return (
        <footer className="mt-4 w-screen bg-neutral-900 border-t">
            <div className="w-full max-w-screen-2xl mx-auto py-6 flex items-center justify-between gap-6">
                <p className="text-sm font-medium">
                    &copy; Netflix Clone, Next 14 2024. Created by <Link href="https://github.com/yankes404" target="_blank"><span className="text-red-500 hover:underline">yankes404</span></Link>
                </p>
                <div className="text-sm flex items-center gap-x-3 text-muted-foreground">
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