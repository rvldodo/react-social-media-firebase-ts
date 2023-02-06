import { Posts } from "./Home"
import { auth, db } from "../../config/firebaseAuth"
import { useAuthState } from "react-firebase-hooks/auth"
import { addDoc ,getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore"
import { useEffect, useState } from "react"

interface Props {
    post: Posts
}

interface Like {
    likeId: string;
    userId: string;
}

export const Post = (props: Props) => {
    const { post } = props
    const [user] = useAuthState(auth)

    const [likes, setLikes] = useState<Like[] | null>(null)

    const likesRef = collection(db, "likes")

    const likesDoc = query(likesRef, where("postId", "==", post.id))

    const getLikes = async () => {
        const data = await getDocs(likesDoc)
        setLikes(data.docs.map(doc => ({userId: doc.data().userId, likeId: doc.id})))
    }

    const addLikes = async () => {
        try {
            const newDocs = await addDoc(likesRef, {
                userId: user?.uid,
                postId: post.id
            })

            if(user) {
                setLikes((prev) => 
                    prev ? [...prev, {userId: user?.uid, likeId: newDocs.id}] : [{userId: user?.uid, likeId: newDocs.id}]
                )
            }
        } catch (err) {
            console.log(err);
        }
    }

    const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );

      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);
      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

    useEffect(() => {
        getLikes()
    }, [])

    return (
        <div>
           <div className="title">
            <h2>{post.title}</h2>
           </div>
           <div className="body">
            <p>{post.description}</p>
           </div>
           <div className="footer">
            <p>@{post.username}</p>
            <button onClick={hasUserLiked ? removeLike : addLikes}>{hasUserLiked ?  <>&#128078;</> : <>&#128077;</>}</button>
            {likes && <p> Likes: {likes?.length} </p>}
           </div>
        </div>
    )
}