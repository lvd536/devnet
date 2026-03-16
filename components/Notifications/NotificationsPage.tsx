"use client";

import { auth } from "@/lib/firebase/firebase";
import { Check, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import useRealtimeNotifications from "@/hooks/useRealtimeNotifications";
import NotificationRow from "@/components/Notifications/NotificationRow";

export default function NotificationsPage() {
    const userId = auth.currentUser?.uid;
    const {
        loading,
        notifications,
        unreadCount,
        toggleRead,
        markAllRead,
        clearAll,
        deleteNotify,
    } = useRealtimeNotifications(userId);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl font-semibold">Уведомления</h1>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={markAllRead}
                        title="Отметить всё как прочитанное"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        <p className="max-sm:hidden">Отметить всё</p>
                        {unreadCount ? (
                            <span className="ml-2 text-sm text-muted-foreground">
                                ({unreadCount})
                            </span>
                        ) : null}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={clearAll}
                        title="Очистить все"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Очистить
                    </Button>
                </div>
            </div>

            <Card className="p-0">
                <ScrollArea className="h-[60vh]">
                    <div className="divide-y divide-border">
                        {loading ? (
                            <div className="p-6 text-center text-sm text-muted-foreground">
                                Загрузка...
                            </div>
                        ) : notifications && notifications.length > 0 ? (
                            notifications.map((n) => (
                                <NotificationRow
                                    key={n.id}
                                    n={n}
                                    onToggle={() => toggleRead(n)}
                                    onRemove={() => deleteNotify(n.id)}
                                />
                            ))
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    У вас пока нет уведомлений
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    );
}
