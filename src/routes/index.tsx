import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchClients } from '@/api/clients'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const Route = createFileRoute('/')({
    component: ClientsList,
})

function ClientsList() {
    const { data: clients, isLoading, error } = useQuery({
        queryKey: ['clients'],
        queryFn: fetchClients,
    })

    if (isLoading) return <div>Загрузка клиентов...</div>
    if (error) return <div>Ошибка: {error.message}</div>

    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-bold mb-4">Клиенты</h1>
            {clients?.map((client) => (
                <Link
                    key={client.id}
                    to="/clients/$clientId"
                    params={{ clientId: client.id }}
                    className="block"
                >
                    <Card className="hover:bg-accent transition-colors cursor-pointer">
                        <CardContent className="flex items-center gap-3 py-4">
                            <Avatar>
                                <AvatarFallback>
                                    {client.name.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{client.name}</div>
                                <div className="text-sm text-muted-foreground">
                                    {client.username}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}