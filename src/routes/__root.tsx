import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
    component: RootLayout,
})

function RootLayout() {
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto px-4 py-3">
                    <Link
                        to="/"
                        className="text-lg font-semibold text-foreground no-underline hover:opacity-80"
                    >
                        Clients Chat
                    </Link>
                </div>
            </header>
            <main className="container mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    )
}