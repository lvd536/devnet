import ProfilePostCreation from "../../PostCreation";
import ProfilePostList from "./ProfilePostList";

export default function ProfilePosts() {
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <ProfilePostCreation />
            <ProfilePostList />
        </div>
    );
}
