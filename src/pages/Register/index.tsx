import { useState, useRef, useEffect, FormEvent } from "react";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Login/Login.module.scss";
import { publicRequest } from "@/utils/request";
import { checkIcon, xIcon } from "@/assets/icons";

const REGISTER_URL = "/auth/register";
const cx = classNames.bind(styles);

const USER_REGEX = /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
const PWD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

function Register() {
   const navigate = useNavigate();
   const userInputRef = useRef<HTMLInputElement>(null);
   const prevUser = useRef("");

   const [loading, setLoading] = useState(false);
   const [user, setUser] = useState("");
   const [validName, setValidName] = useState(false);
   const [userFocus, setUserFocus] = useState(false);

   const [password, setPassword] = useState("");
   const [validPwd, setValidPwd] = useState(false);
   const [passwordFocus, setPasswordFocus] = useState(false);

   const [matchPwg, setMatchPwg] = useState("");
   const [validMatchPwg, setValidMatchPwg] = useState(false);

   const [errMsg, setErrorMsg] = useState("");

   useEffect(() => {
      userInputRef.current?.focus();
   }, []);

   const handleClear = () => {
      setUser("");
      setPassword("");
   };

   // validate username
   useEffect(() => {
      const result = USER_REGEX.test(user);

      setValidName(result);
   }, [user]);

   // validate password
   useEffect(() => {
      const result = PWD_REGEX.test(password);
      setValidPwd(result);
      let match = password === matchPwg;

      if (!password) match = false;
      setValidMatchPwg(match);
   }, [password, matchPwg]);

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      //  if submit with js tool
      const test1 = USER_REGEX.test(user);
      const test2 = PWD_REGEX.test(password);

      if (!test1 || !test2) {
         setErrorMsg("missing payload");
         return;
      }

      try {
         setLoading(true);

         await publicRequest.post(REGISTER_URL, JSON.stringify({ username: user, password: password }), {
            headers: { "Content-Type": "application/json" },
         });

         handleClear();
         navigate("/login");
      } catch (error: any) {
         if (!error?.response) {
            setErrorMsg("No server response");
         } else if (error?.response.status === 409) {
            setErrorMsg("Tên tài khoản đã tồn tại");
            prevUser.current = user;
         } else {
            setErrorMsg("Đăng ký thất bại");
         }
      } finally {
         setLoading(false);
      }
   };

   // console.log(prevUser.current === user);
   return (
      <div className={cx("page")}>
         <form className={cx("form", { disable: loading })} onSubmit={handleSubmit}>
            {errMsg && <h2 className={cx("error-msg")}>{errMsg}</h2>}
            <h1 className={cx("title")}>Đăng ký</h1>
            <div className={cx("form-group")}>
               <label htmlFor="username">
                  Tên tài khoản
                  <span className={validName ? "" : "hide"}>{checkIcon}</span>
                  <span className={validName || !user ? "hide" : ""}>{xIcon}</span>
               </label>
               <input
                  id="username"
                  ref={userInputRef}
                  autoComplete="off"
                  type="text"
                  value={user}
                  aria-describedby="note"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  onChange={(e) => setUser(e.target.value.trim() && e.target.value)}
               />
               <p id="note" className={cx(userFocus && user && !validName ? "instruction" : "hide")}>
                  4 - 24 ký tự <br />
                  Phải bắt đầu bằng chữ cái <br />
                  Cho phép chữ Hoa, gạch chân, số
               </p>
            </div>
            <div className={cx("form-group")}>
               <label htmlFor="password">
                  Mật khẩu
                  <span className={validPwd ? "" : "hide"}>{checkIcon}</span>
                  <span className={validPwd || !password ? "hide" : ""}>{xIcon}</span>
               </label>
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
               <p id="note" className={cx(passwordFocus && password && !validPwd ? "instruction" : "hide")}>
                  6 - 24 ký tự <br />
                  Phải có chứa chữ hoa, chữ thường, số và ký tự đặc biệt
               </p>
            </div>
            <div className={cx("form-group")}>
               <label htmlFor="password-confirm">
                  Nhập lại mật khẩu
                  <span className={validMatchPwg && validPwd ? "" : "hide"}>{checkIcon}</span>
                  <span className={(validMatchPwg && validPwd) || !matchPwg ? "hide" : ""}>{xIcon}</span>
               </label>
               <input
                  type="text"
                  id="password-confirm"
                  autoComplete="off"
                  value={matchPwg}
                  onChange={(e) => setMatchPwg(e.target.value.trim() && e.target.value)}
               />
            </div>
            <span className={cx("messgae-container")}></span>
            <button
               className={cx(
                  "submit-btn",
                  !validName || !validPwd || !validMatchPwg || prevUser.current === user ? "disable" : ""
               )}
               type="submit"
            >
               Đăng ký
            </button>
            <span className={cx("register-text")}>
               Đã có tài khoản?
               <Link className={cx("switch")} to="/login">
                  {" "}
                  Đăng nhập
               </Link>
            </span>
         </form>
      </div>
   );
}
export default Register;
