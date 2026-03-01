import { useParams } from "next/navigation";
import PostCreation from "../../Post/PostCreation";
import ProfilePostList from "./ProfilePostList";

export default function ProfilePosts() {
    const { userId } = useParams<{ userId: string }>();
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            {!userId && <PostCreation />}
            <ProfilePostList />
        </div>
    );
}
