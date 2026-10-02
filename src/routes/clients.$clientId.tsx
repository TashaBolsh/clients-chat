import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { fetchMessages, type MessagesResponse } from '@/api/messages'

export const Route = createFileRoute('/clients/$clientId')({
    component: ClientChat,
})

function ClientChat() {
    const { clientId } = Route.useParams()
    const scrollRef = useRef<HTMLDivElement>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)
    const prevScrollHeightRef = useRef<number>(0)

    const {
        data,
        fetchPreviousPage,
        hasPreviousPage,
        isFetchingPreviousPage,
        isLoading,
    } = useInfiniteQuery<MessagesResponse>({
        queryKey: ['messages', clientId],
        queryFn: ({ pageParam }) =>
            fetchMessages(clientId, pageParam as number | null),
        initialPageParam: null,
        getPreviousPageParam: (firstPage) => firstPage.prevCursor,
        getNextPageParam: () => undefined,
    })

    const allMessages = data?.pages.flatMap((page) => page.messages) ?? []

    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    hasPreviousPage &&
                    !isFetchingPreviousPage
                ) {
                    if (scrollRef.current) {
                        prevScrollHeightRef.current = scrollRef.current.scrollHeight
                    }
                    fetchPreviousPage()
                }
            },
            { threshold: 0.1 },
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage])

    useLayoutEffect(() => {
        if (prevScrollHeightRef.current > 0 && scrollRef.current) {
            const newScrollHeight = scrollRef.current.scrollHeight
            const diff = newScrollHeight - prevScrollHeightRef.current
            if (diff > 0) {
                scrollRef.current.scrollTop += diff
            }
            prevScrollHeightRef.current = 0
        }
    }, [data?.pages])

    useEffect(() => {
        if (!isLoading && scrollRef.current && allMessages.length > 0) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    if (isLoading) return <div>Загрузка сообщений...</div>

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            <h1 className="text-xl font-bold mb-3">Чат с клиентом #{clientId}</h1>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto rounded-md border bg-card"
            >
                <div className="p-4 space-y-3">
                    <div ref={sentinelRef} className="h-1" />

                    {isFetchingPreviousPage && (
                        <div className="text-center text-sm text-muted-foreground py-2">
                            Загрузка предыдущих сообщений...
                        </div>
                    )}

                    {!hasPreviousPage && allMessages.length > 0 && (
                        <div className="text-center text-sm text-muted-foreground py-2">
                            Начало переписки
                        </div>
                    )}

                    {allMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={
                                msg.direction === 'in'
                                    ? 'flex justify-start'
                                    : 'flex justify-end'
                            }
                        >
                            <div
                                className={
                                    msg.direction === 'in'
                                        ? 'max-w-[70%] rounded-lg bg-muted px-3 py-2 text-sm'
                                        : 'max-w-[70%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground'
                                }
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}