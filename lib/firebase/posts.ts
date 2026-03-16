import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    orderBy,
    where,
    collectionGroup,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { IComment, ILike, IPost } from "@/interfaces/interfaces";
import { getProjectData } from "./projects";
import { getUserData } from "./users";

export async function getAllPosts() {
    const postsRef = collection(db, "posts");
    const postsQuery = query(postsRef, orderBy("createdAt", "desc"));
    const postsSnap = await getDocs(postsQuery);

    if (!postsSnap.empty) {
        return postsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as IPost[];
    }

    return undefined;
}

export async function getPost(postId: string) {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists) return undefined;
    return { id: postSnap.id, ...postSnap.data() } as IPost;
}

export async function getPostData(post: IPost) {
    const project = post.projectId
        ? await getProjectData(post.projectId)
        : undefined;
    const user = await getUserData(post.authorId);
    return { project, user };
}

export async function getLikes(postId: string) {
    const likesSnapshot = await getDocs(
        collection(db, "posts", postId, "likes"),
    );
    return likesSnapshot.empty
        ? undefined
        : (likesSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          })) as ILike[]);
}

export async function getIsLiked(postId: string, userId: string) {
    try {
        const likeSnap = await getDoc(
            doc(db, "posts", postId, "likes", userId),
        );
        if (likeSnap.exists()) return true;
        else return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function getComments(postId: string) {
    const commentSnap = await getDocs(
        collection(db, "posts", postId, "comments"),
    );
    return commentSnap.empty
        ? undefined
        : (commentSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          })) as IComment[]);
}

function isPost(post: IPost | null): post is IPost {
    return post !== null;
}

export async function getLikedPosts(userId: string) {
    const postIds = await getPostsLikedByUser(userId);

    const posts = await Promise.all(
        postIds.map(async (postId) => {
            if (!postId) return null;
            const snap = await getDoc(doc(db, "posts", postId));
            return snap.exists()
                ? ({ id: snap.id, ...snap.data() } as IPost)
                : null;
        }),
    );

    return posts.filter(isPost);
}

async function getPostsLikedByUser(userId: string) {
    if (!userId) return [];

    const q = query(
        collectionGroup(db, "likes"),
        where("userId", "==", userId),
    );

    const snap = await getDocs(q);

    return snap.docs
        .map((doc) => {
            const postId = doc.ref.parent.parent?.id;
            return postId;
        })
        .filter(Boolean);
}
