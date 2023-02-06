import { auth, provider } from "../config/firebaseAuth";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider);
    navigate("/");
  };

  return (
    <div>
      <p> Sign In With Google To Continue </p>
      <button onClick={signInWithGoogle}> Google </button>
    </div>
  );
};
