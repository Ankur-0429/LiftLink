import { signIn } from "next-auth/react";

const Login = () => {
    return (
        <button onClick={()=>signIn("google")}>google</button>
    )
};

export default Login