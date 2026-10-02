import type { Message } from '@/mocks/data'

export interface MessagesResponse {
    messages: Message[]
    prevCursor: number | null
    hasMore: boolean
}

export async function fetchMessages(
    clientId: string,
    cursor: number | null,
): Promise<MessagesResponse> {
    const params = new URLSearchParams({ limit: '20' })
    if (cursor !== null) {
        params.set('cursor', String(cursor))
    }

    const res = await fetch(`/api/clients/${clientId}/messages?${params}`)
    if (!res.ok) throw new Error('Failed to fetch messages')
    return res.json()
}