import classNames from "classnames/bind";
import { useState, useRef, useEffect, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.scss";
import { useAuth } from "@/store/AuthContext";
import { publicRequest } from "@/utils/request";
import useToggleCheckbox from "@/hooks/useToggle";
import { Button } from "@/components";

const LOGIN_URL = "/auth/login";
const cx = classNames.bind(styles);

function LoginPage() {
   const { auth, setAuth, loading } = useAuth();

   const [user, setUser] = useState("");
   const [password, setPassword] = useState("");
   const [errMsg, setErrorMsg] = useState("");
   const [apiLoading, setApiLoading] = useState(false);

   const userInputRef = useRef<HTMLInputElement>(null);
   const [runCheckAuth, setRunCheckAuth] = useState(false);

   const { value, toggle } = useToggleCheckbox("persist", false);
   const navigate = useNavigate();
   const location = useLocation();
   const from = location?.state?.from?.pathname || "/";

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      try {
         setApiLoading(true);

         const response = await publicRequest.post(LOGIN_URL, JSON.stringify({ username: user, password: password }), {
            headers: { "Content-Type": "application/json" },
         });

         console.log(response);
         const token = response?.data?.token;

         if (token) {
            setAuth({ token });
            setUser("");
            setPassword("");
            navigate(from, { replace: true });
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

      if (auth) navigate('/');
      else setRunCheckAuth(true);
   }, [loading]);

   useEffect(() => {
      userInputRef.current?.focus();
   }, []);

   if (!runCheckAuth || loading) return;

   return (
      <div className={cx("page")}>
         <form className={cx("form", { disable: apiLoading })} onSubmit={handleSubmit}>
            {errMsg && <h2 className={cx("error-msg")}>{errMsg}</h2>}
            <h1>Đăng nhập</h1>
            <div className={cx("form-group")}>
               <label htmlFor="name">Tài khoản</label>
               <input
                  ref={userInputRef}
                  autoComplete="off"
                  type="text"
                  required
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
               />
            </div>
            <div className={cx("form-group")}>
               <label htmlFor="image">Mật khẩu</label>
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

            <Button isLoading={apiLoading} primary className="h-[40px] mt-[20px]" type="submit">
               Đăng nhập
            </Button>
            <span className={cx("register-text")}>
               Chưa có tài khoản?
               <Link to="/register"> Đăng ký ngay</Link>
            </span>
         </form>
      </div>
   );
}
export default LoginPage;
