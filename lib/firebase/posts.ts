import { db } from "@/lib/firebase/config"
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import type { Post, NewPost, PostUpdate } from "@/types"

// Create a new post
export async function createPost(postData: NewPost): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating post:", error)
    throw new Error("Failed to create post")
  }
}

// Get all posts
export async function getAllPosts(): Promise<Post[]> {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        content: data.content,
        authorId: data.authorId,
        authorName: data.authorName,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt || null,
      }
    })
  } catch (error) {
    console.error("Error getting posts:", error)
    throw new Error("Failed to get posts")
  }
}

// Get posts by user ID
export async function getUserPosts(userId: string): Promise<Post[]> {
  try {
    const q = query(collection(db, "posts"), where("authorId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        content: data.content,
        authorId: data.authorId,
        authorName: data.authorName,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt || null,
      }
    })
  } catch (error) {
    console.error("Error getting user posts:", error)
    throw new Error("Failed to get user posts")
  }
}

// Get a post by ID
export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const docRef = doc(db, "posts", postId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    const data = docSnap.data()
    return {
      id: docSnap.id,
      content: data.content,
      authorId: data.authorId,
      authorName: data.authorName,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt || null,
    }
  } catch (error) {
    console.error("Error getting post:", error)
    throw new Error("Failed to get post")
  }
}

// Update a post
export async function updatePost(postId: string, postData: PostUpdate): Promise<void> {
  try {
    const postRef = doc(db, "posts", postId)
    await updateDoc(postRef, {
      ...postData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating post:", error)
    throw new Error("Failed to update post")
  }
}

// Delete a post
export async function deletePost(postId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "posts", postId))
  } catch (error) {
    console.error("Error deleting post:", error)
    throw new Error("Failed to delete post")
  }
}
