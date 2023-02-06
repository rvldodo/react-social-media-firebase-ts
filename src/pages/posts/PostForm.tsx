import * as yup from "yup"
import { useForm } from "react-hook-form" 
import { addDoc, collection } from "firebase/firestore"
import { yupResolver } from "@hookform/resolvers/yup"
import { db, auth } from "../../config/firebaseAuth"
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom"

interface CreateForm {
    title: string;
    description: string;
}

export const PostForm = () => {
    const [user] = useAuthState(auth)
    const navigate = useNavigate()

    const schema = yup.object().shape({
        title: yup.string().required("You must add title"),
        description: yup.string().required("You must add description")
    })

    const { register, handleSubmit, formState: {errors} } = useForm<CreateForm>({
        resolver: yupResolver(schema)
    })

    const postRef = collection(db, "posts")

    const createPost = async (data: CreateForm) => {
        await addDoc(postRef, {
            ...data,
            username: user?.displayName,
            userId: user?.uid
        })
        navigate('/')
    }

    return <form onSubmit={handleSubmit(createPost)}>
        <input type="text" placeholder="Title" {...register("title")}/>
        <p style={{ color: "red" }}>{errors.title?.message}</p>
        <textarea placeholder="Description" {...register("description")}/>
        <p style={{ color: "red" }}>{errors.description?.message}</p>
        <input type="submit" className="submitForm"/>
    </form>
}