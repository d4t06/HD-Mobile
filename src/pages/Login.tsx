import { useState, useEffect, FormEvent, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";
import axios from "axios";
import { classes as loginClasses } from "@/shares/classes/loginForm";
import { Button } from "@/components";
import Logo from "@/components/ui/Logo";

const LOGIN_URL = import.meta.env.VITE_API_ENDPOINT + "/auth/login";

export default function LoginPage() {
   const { auth, setAuth, loading } = useAuth();

   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [errMsg, setErrorMsg] = useState("");
   const [apiLoading, setApiLoading] = useState(false);

   const usernameRef = useRef<HTMLInputElement>(null);
   const [runCheckAuth, setRunCheckAuth] = useState(false);

   const navigate = useNavigate();
   const location = useLocation();
   const from = useRef(location?.state?.from || "/");

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      try {
         setApiLoading(true);

         const response = await axios.post(
            LOGIN_URL,
            {
               username: username,
               password: password,
            },
            {
               withCredentials: true,
            },
         );

         const data = response.data.data as AuthResponse;

         if (data) {
            setAuth({
               role: data.userInfo.role,
               token: data.token,
               username: data.userInfo.username,
            });

            setUsername("");
            setPassword("");

            navigate(from.current);
         }
      } catch (error: any) {
         if (!error?.response) {
            setErrorMsg("No server response");
         } else if (error?.response.status === 401) {
            setErrorMsg("User name or password is incorrect !");
         } else {
            setErrorMsg("Sign in fail");
         }
         console.log(">>> error", error);
      } finally {
         setApiLoading(false);
      }
   };

   useEffect(() => {
      if (loading) return;

      if (auth) from ? navigate(from.current) : navigate("/");
      else setRunCheckAuth(true);
   }, [loading]);

   useEffect(() => {
      usernameRef.current?.focus();
   }, [runCheckAuth]);

   if (!runCheckAuth || loading) return;

   return (
      <div className={loginClasses.wrapper}>
         <div className={loginClasses.container}>
            <form onSubmit={handleSubmit} className={loginClasses.form}>
               <div className={loginClasses.left}>
                  <Logo />
                  <h1 className="text-3xl text-[#1f1f1f] mt-[10px]">Sign in</h1>

                  {errMsg && <p className={loginClasses.errorMessage}>{errMsg}</p>}
               </div>
               <div className={loginClasses.right}>
                  <div className={loginClasses.inputGroup}>
                     <label className={loginClasses.label} htmlFor="username">
                        Username
                     </label>
                     <input
                        className={loginClasses.input}
                        ref={usernameRef}
                        id="username"
                        autoComplete="off"
                        type="text"
                        value={username}
                        aria-describedby="note"
                        onChange={(e) => setUsername(e.target.value)}
                     />
                  </div>
                  <div className={loginClasses.inputGroup}>
                     <label className={loginClasses.label} htmlFor="password">
                        Password
                     </label>
                     <input
                        className={loginClasses.input}
                        type="text"
                        id="password"
                        autoComplete="off"
                        value={password}
                        aria-describedby="note"
                        onChange={(e) =>
                           setPassword(e.target.value.trim() && e.target.value)
                        }
                     />
                  </div>

                  <div className="md:text-right mt-3">
                     <Button
                        type="submit"
                        loading={apiLoading}
                        colors={"third"}
                        className="w-full font-medium"
                     >
                        Sign In
                     </Button>

                     <p className="mt-[20px] font-medium text-[#3f3f3f]">
                        Don't have an account jet?,
                        <Link to={"/register"} className="text-[#cd1818]">
                           {" "}
                           Sign Up
                        </Link>
                     </p>
                  </div>
               </div>
            </form>
         </div>
      </div>
   );
}
