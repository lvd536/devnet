import { auth } from "@/lib/firebase/firebase";

export async function deleteUser(uid: string) {
    const token = await auth.currentUser?.getIdToken();

    const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            uid,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(data);
        alert("Ошибка удаления пользователя");
        return;
    }

    alert("Пользователь удалён");
}
