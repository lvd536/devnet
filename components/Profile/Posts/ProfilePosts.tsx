import ProfilePostCreation from "./ProfilePostCreation";

export default function ProfilePosts() {
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <ProfilePostCreation />
            <div>Постов нет</div>
        </div>
    );
}
