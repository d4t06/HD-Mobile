import { useState, useRef, useEffect, FormEvent, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { publicRequest } from "@/utils/request";
import { useToast } from "@/store/ToastContext";
import { classes as loginClasses } from "@/shares/classes/loginForm";
import { Button } from "@/components";
import Logo from "@/components/ui/Logo";

const REGISTER_URL = "/auth/register";

// const USER_REGEX = /^(?=.{4,20}$)[a-zA-Z].*/;
const PWD_REGEX = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

export default function Register() {
   const userInputRef = useRef<HTMLInputElement>(null);
   // const prevUser = useRef("");

   const [loading, setLoading] = useState(false);

   const [username, setUsername] = useState("");

   const [password, setPassword] = useState("");
   const [validPwd, setValidPwd] = useState(false);

   const [matchPwg, setMatchPwg] = useState("");
   const [validMatchPwg, setValidMatchPwg] = useState(false);

   const [errMsg, setErrorMsg] = useState("");

   // hooks
   const { setSuccessToast } = useToast();
   const navigate = useNavigate();

   const ableToSubmit = useMemo(
      () => validPwd && validMatchPwg,
      [validPwd, validMatchPwg],
   );

   useEffect(() => {
      userInputRef.current?.focus();
   }, []);

   const handleClear = () => {
      setUsername("");
      setPassword("");
   };

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const validPassword = PWD_REGEX.test(password);

      if (!validPassword) {
         setErrorMsg("missing payload");
         return;
      }

      try {
         setLoading(true);

         await publicRequest.post(REGISTER_URL, {
            password: password,
            username: username,
         });

         setSuccessToast("Register successful");
         handleClear();
         navigate("/login");
      } catch (error: any) {
         if (!error?.response) {
            setErrorMsg("No server response");
         } else if (error?.response.status === 409) {
            setErrorMsg("This user name had taken");
            // prevUser.current = username;
         } else {
            setErrorMsg("Register fail");
         }
      } finally {
         setLoading(false);
      }
   };

   // validate password
   useEffect(() => {
      const result = PWD_REGEX.test(password);
      setValidPwd(result);
      let match = password === matchPwg;

      if (!password) match = false;
      setValidMatchPwg(match);
   }, [password, matchPwg]);

   return (
      <>
         <div className={loginClasses.wrapper}>
            <div className={loginClasses.container}>
               <form
                  aria-disabled={true}
                  onSubmit={handleSubmit}
                  className={loginClasses.form}
               >
                  <div className={loginClasses.left}>
                     <Logo />
                     <h1 className="text-3xl text-[#1f1f1f] mt-[10px]">Sign up</h1>

                     {errMsg && <p className={loginClasses.errorMessage}>{errMsg}</p>}
                  </div>
                  <div className={loginClasses.right}>
                     <div className={loginClasses.inputGroup}>
                        <label className={loginClasses.label} htmlFor="username">
                           Username
                        </label>
                        <input
                           className={loginClasses.input}
                           id="username"
                           autoComplete="off"
                           type="text"
                           value={username}
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

                     <div className={loginClasses.inputGroup}>
                        <label className={loginClasses.label} htmlFor="password">
                           Confirm password
                        </label>
                        <input
                           type="text"
                           id="password-confirm"
                           className={loginClasses.input}
                           autoComplete="off"
                           value={matchPwg}
                           onChange={(e) =>
                              setMatchPwg(e.target.value.trim() && e.target.value)
                           }
                        />
                     </div>

                     <div className="md:text-right mt-3">
                        <Button
                           type="submit"
                           colors={"third"}
                           disabled={!ableToSubmit}
                           loading={loading}
                           className="w-full font-medium"
                        >
                           Sign Up
                        </Button>

                        <p className="mt-[20px] font-medium text-[#3f3f3f]">
                           Already have an account ?,
                           <Link to={"/login"} className="text-[#cd1818]">
                              {" "}
                              Sign In
                           </Link>
                        </p>
                     </div>
                  </div>
               </form>
            </div>
         </div>
      </>
   );
}
