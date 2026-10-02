export interface Client {
    id: string
    name: string
    username: string
    avatar?: string
}

export interface Message {
    id: number
    clientId: string
    text: string
    direction: 'in' | 'out'
    createdAt: string
}
export const clients: Client[] = [
    { id: '1', name: 'Алексей Иванов', username: '@alexey' },
    { id: '2', name: 'Мария Петрова', username: '@maria_p' },
    { id: '3', name: 'Дмитрий Сидоров', username: '@dsidorov' },
]

// Генерируем 200 сообщений на клиента
function generateMessages(clientId: string): Message[] {
    const messages: Message[] = []
    const now = Date.now()

    for (let i = 0; i < 200; i++) {
        messages.push({
            id: i + 1,
            clientId,
            text: `Сообщение #${i + 1} от ${clientId === '1' ? 'клиента' : 'бота'}`,
            direction: i % 2 === 0 ? 'in' : 'out',
            createdAt: new Date(now - (200 - i) * 60000).toISOString(),
        })
    }
    return messages
}

export const messagesByClient: Record<string, Message[]> = {
    '1': generateMessages('1'),
    '2': generateMessages('2'),
    '3': generateMessages('3'),
}