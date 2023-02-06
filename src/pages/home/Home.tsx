import { useEffect, useState } from "react"
import { db } from "../../config/firebaseAuth"
import { collection, getDocs } from "firebase/firestore"
import { Post } from "./Post";

export interface Posts {
    id: string;
    title: string;
    description: string;
    userId: string;
    username: string;
}

export const Home = () => {
    const [postsList, setPostsList] = useState<Posts[] | null>(null)
    const postRef = collection(db, "posts")

    const getPosts = async () => {
        const data = await getDocs(postRef)
        setPostsList(
            data.docs.map((doc) => ({ ...doc.data(), id: doc.id}))as Posts[]
        )
    } 

    useEffect(() => {
        getPosts()
    }, [])

    return (
    <div>
        {postsList?.map(post => (
            <Post post={post} key={post.id}/>
        ))}
    </div>
    )
}