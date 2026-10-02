import { http, HttpResponse } from 'msw'
import { clients, messagesByClient } from './data'

export const handlers = [
    // Список клиентов
    http.get('/api/clients', () => {
        return HttpResponse.json(clients)
    }),

    // Сообщения с курсорной пагинацией
    // cursor = id самого старого загруженного сообщения
    // Возвращаем сообщения с id < cursor (более старые)
    http.get('/api/clients/:clientId/messages', ({ params, request }) => {
        const { clientId } = params
        const url = new URL(request.url)
        const cursor = url.searchParams.get('cursor')
        const limit = parseInt(url.searchParams.get('limit') || '20', 10)

        const all = messagesByClient[clientId as string] || []

        // Фильтруем: если курсор есть, берём только сообщения с id < cursor
        let filtered = all
        if (cursor) {
            const cursorId = parseInt(cursor, 10)
            filtered = all.filter((m) => m.id < cursorId)
        }

        // Берём последние limit штук из отфильтрованных (самые свежие из доступных)
        const batch = filtered.slice(-limit)

        // prevCursor = id самого старого сообщения в батче
        const prevCursor = batch.length > 0 ? batch[0].id : null
        const hasMore = batch.length === limit && filtered.length > limit

        return HttpResponse.json({
            messages: batch,
            prevCursor,
            hasMore,
        })
    }),
]