import { storage } from "@/lib/firebase/config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Failed to upload image")
  }
}
