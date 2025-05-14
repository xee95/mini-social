export interface Post {
  id: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  updatedAt?: string | null
  authorPhotoURL?: string
}

export interface NewPost {
  content: string
  authorId: string
  authorName: string
  createdAt: string
  
}

export interface PostUpdate {
  content?: string
  updatedAt?: string
}

export interface User {
  uid: string
  email: string
  displayName: string
  createdAt: string
  
}
