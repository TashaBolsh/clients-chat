import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { routeTree } from './routeTree.gen'
import './index.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
        },
    },
})

const router = createRouter({
    routeTree,
    basepath: '/clients-chat',
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

async function enableMocking() {
//    if (!import.meta.env.DEV) return
    const { worker } = await import('./mocks/browser')
    await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
            url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
        },
    })
}

enableMocking().then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </StrictMode>,
    )
})