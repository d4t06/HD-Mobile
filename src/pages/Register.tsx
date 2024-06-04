import { useState, useRef, useEffect, FormEvent, useMemo } from "react";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login/Login.module.scss";
import { publicRequest } from "@/utils/request";
import { useToast } from "@/store/ToastContext";
import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";
import PushButton from "@/components/ui/PushButton";

const REGISTER_URL = "/auth/register";
const cx = classNames.bind(styles);

// const USER_REGEX = /^(?=.{4,20}$)[a-zA-Z].*/;
const PWD_REGEX = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

export default function Register() {
   const userInputRef = useRef<HTMLInputElement>(null);
   // const prevUser = useRef("");

   const [loading, setLoading] = useState(false);

   const [username, setUsername] = useState("");

   const [password, setPassword] = useState("");
   const [validPwd, setValidPwd] = useState(false);
   const [passwordFocus, setPasswordFocus] = useState(false);

   const [matchPwg, setMatchPwg] = useState("");
   const [validMatchPwg, setValidMatchPwg] = useState(false);

   const [errMsg, setErrorMsg] = useState("");

   // hooks
   const { setSuccessToast } = useToast();
   const navigate = useNavigate();

   const ableToSubmit = useMemo(
      () => validPwd && validMatchPwg,
      [validPwd, validMatchPwg]
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

   // validate username
   // useEffect(() => {
   //    const result = USER_REGEX.test(username);

   //    setValidName(result);
   // }, [username]);

   // validate password
   useEffect(() => {
      const result = PWD_REGEX.test(password);
      setValidPwd(result);
      let match = password === matchPwg;

      if (!password) match = false;
      setValidMatchPwg(match);
   }, [password, matchPwg]);

   const classes = {
      constructor:
         "bg-[#333] p-[6px] rounded-[6px] text-[14px] text-white origin-top duration-[.3s] transition-all",
      checkIcon: "text-emerald-500 w-[24px]",
      xIcon: "text-red-500 w-[24px]",
   };

   return (
      <div className={cx("page")}>
         <form
            className={cx("form", "space-y-[20px]", { disable: loading })}
            onSubmit={handleSubmit}
         >
            {errMsg && <h2 className={cx("error-msg")}>{errMsg}</h2>}
            <h1 className={cx("title")}>Đăng ký</h1>
            <div className={cx("form-group")}>
               <div className="flex items-center space-x-[4px]">
                  <label htmlFor="username">Tên tài khoản</label>
               </div>

               <input
                  id="username"
                  autoComplete="off"
                  type="text"
                  value={username}
                  aria-describedby="note"
                  onChange={(e) => setUsername(e.target.value)}
               />
            </div>
            <div className={cx("form-group")}>
               <div className="flex items-center space-x-[4px]">
                  <label htmlFor="password">Mật khẩu</label>
                  {password && (
                     <span>
                        {validPwd ? (
                           <CheckIcon className={`${classes.checkIcon} `} />
                        ) : (
                           <XMarkIcon className={`${classes.xIcon} `} />
                        )}
                     </span>
                  )}
               </div>
               <input
                  type="text"
                  id="password"
                  autoComplete="off"
                  value={password}
                  aria-describedby="note"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                  onChange={(e) => setPassword(e.target.value.trim() && e.target.value)}
               />
               <p
                  id="note"
                  className={`${classes.constructor} ${
                     passwordFocus && password && !validPwd
                        ? "max-h-[200px] opacity-100"
                        : "max-h-0 my-[-6px] opacity-0"
                  }`}
               >
                  6 - 24 ký tự <br />
                  Bao gồm số và chữ, cho phép ký tự đặc biệt
               </p>
            </div>
            <div className={cx("form-group")}>
               <div className="flex items-center space-x-[4px]">
                  <label htmlFor="password-confirm">Nhập lại mật khẩu</label>
                  {password && (
                     <span className={validMatchPwg && validPwd ? "" : "hide"}>
                        {validMatchPwg && validPwd ? (
                           <CheckIcon className={`${classes.checkIcon} `} />
                        ) : (
                           <XMarkIcon className={`${classes.xIcon} `} />
                        )}
                     </span>
                  )}
               </div>

               <input
                  type="text"
                  id="password-confirm"
                  autoComplete="off"
                  value={matchPwg}
                  onChange={(e) => setMatchPwg(e.target.value.trim() && e.target.value)}
               />
            </div>

            <div className="">
               <PushButton
                  loading={loading}
                  disabled={!ableToSubmit}
                  size={"clear"}
                  baseClassName="mt-[10px] w-full"
                  className={`h-[40px]`}
                  type="submit"
               >
                  Đăng ký
               </PushButton>
               <p className={cx("register-text", "mt-[20px]")}>
                  Đã có tài khoản?
                  <Link className={cx("switch")} to="/login">
                     {" "}
                     Đăng nhập
                  </Link>
               </p>
            </div>
         </form>
      </div>
   );
}
