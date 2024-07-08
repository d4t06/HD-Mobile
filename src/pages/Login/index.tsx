import classNames from "classnames/bind";
import { useState, useEffect, FormEvent, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.scss";
import { useAuth } from "@/store/AuthContext";
import useToggleCheckbox from "@/hooks/useToggle";
import axios from "axios";
import PushButton from "@/components/ui/PushButton";

const LOGIN_URL =
   (import.meta.env.VITE_API_ENDPOINT || "https://hd-mobile-backend-ts.vercel.app/api") +
   "/auth/login";
const cx = classNames.bind(styles);

export default function LoginPage() {
   const { auth, setAuth, loading } = useAuth();

   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [errMsg, setErrorMsg] = useState("");
   const [apiLoading, setApiLoading] = useState(false);

   const phoneNumberInputRef = useRef<HTMLInputElement>(null);
   const [runCheckAuth, setRunCheckAuth] = useState(false);

   const { value, toggle } = useToggleCheckbox("persist", false);
   //  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist") || "false"));
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
            }
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
            setErrorMsg("Tên hoặc mật khẩu không chính xác");
         } else {
            setErrorMsg("Đăng nhâp thất bại");
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
      phoneNumberInputRef.current?.focus();
   }, [runCheckAuth]);

   if (!runCheckAuth || loading) return;

   return (
      <div className={cx("page")}>
         <form
            className={cx("form", "space-y-[20px]", { disable: apiLoading })}
            onSubmit={handleSubmit}
         >
            {errMsg && <h2 className={cx("error-msg")}>{errMsg}</h2>}
            <h1>Login</h1>
            <div className={cx("form-group")}>
               <label htmlFor="name">Username</label>
               <input
                  ref={phoneNumberInputRef}
                  autoComplete="off"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
               />
            </div>
            <div className={cx("form-group")}>
               <label htmlFor="image">Password</label>
               <input
                  type="text"
                  autoComplete="off"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim() && e.target.value)}
               />
            </div>
            <div className={cx("persist-check")}>
               <input type="checkbox" id="persist" checked={value} onChange={toggle} />
               <label className="ml-[8px]" htmlFor="persist">
                  Trust this device :v ?
               </label>
            </div>

            <PushButton loading={apiLoading} type="submit">
               Login
            </PushButton>
            <span className={cx("register-text")}>
               No have account?
               <Link to="/register"> Register</Link>
            </span>
         </form>
      </div>
   );
}
