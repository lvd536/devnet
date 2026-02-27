import ProfilePostList from "../Posts/ProfilePostList";

export default function DProfilePosts() {
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <ProfilePostList isOtherUser />
        </div>
    );
}
