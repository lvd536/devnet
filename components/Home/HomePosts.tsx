import PostCreation from "../PostCreation";
import HomePostList from "./HomePostList";

export default function HomePosts() {
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <PostCreation />
            <HomePostList />
        </div>
    );
}
