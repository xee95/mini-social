export interface Post {
  id: string
  content: string
  imageUrl: string | null
  authorId: string
  authorName: string
  createdAt: string
  updatedAt?: string | null
  authorPhotoURL?: string
}

export interface NewPost {
  content: string
  imageUrl?: string | null
  authorId: string
  authorName: string
  createdAt: string
  
}

export interface PostUpdate {
  content?: string
  imageUrl?: string | null
  updatedAt?: string
}

export interface User {
  uid: string
  email: string
  displayName: string
  createdAt: string
  
}
