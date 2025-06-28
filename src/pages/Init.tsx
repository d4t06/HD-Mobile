import { Button } from "@/components";
import { useToast } from "@/store/ToastContext";
import { sleep } from "@/utils/appHelper";
import { publicRequest } from "@/utils/request";
import { useEffect, useMemo, useRef, useState } from "react";

const INIT_URL = `${import.meta.env.VITE_API_ENDPOINT}/init`;

export default function Init() {
   const { setErrorToast } = useToast();

   const [step, setStep] = useState(0);

   const [isFetching, setIsFetching] = useState(false);
   const [password, setPassword] = useState("");

   const inputRef = useRef<HTMLInputElement>(null);

   const next = () => setStep((prev) => prev + 1);

   const handleSubmit = async () => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         await publicRequest.post(INIT_URL, {
            username: "admin",
            password: password,
         });

         next();
      } catch (error) {
         console.log({ message: error });
         setErrorToast();
      } finally {
         setIsFetching(false);
      }
   };

   const classes = {
      container:
         "rounded-[24px] w-[90vw] md:flex-grow md:w-auto mx-auto my-auto md:mx-[100px] bg-white p-[20px] pb-[30px] md:px-[30px] md:pt-[calc(40px+30px+10px)]",
      form: "flex flex-col md:flex-row justify-between",
      myChat: "text-[26px] leading-[40px] font-[600]",
      right: "space-y-[16px] mt-[20px] md:mt-0",
      inputGroup: "flex flex-col space-y-[2px]",
      label: "text-[#1f1f1f] font-[500]",
      input: "py-[4px] rounded-[6px] border border-black/15 outline-none px-[10px]",
      button:
         "relative font-[500] text-white rounded-[8px] px-[12px] py-[4px] before:absolute before:contents-[''] z-0 before:inset-0 before:bg-[#cd1818]  before:shadow-[0_4px_0_#a00000] before:rounded-[8px] before:z-[-1] active:translate-y-[4px] active:before:shadow-none",
   };

   const ableToSubmit = useMemo(() => !!password, [password]);

   const renderStep = useMemo(() => {
      switch (step) {
         case 0:
            return (
               <>
                  <h1 className="text-[40px] font-[500] text-[#333]">Welcome</h1>

                  <Button
                     colors={"third"}
                     onClick={next}
                     className="!absolute bottom-[60px]"
                  >
                     Next
                  </Button>
               </>
            );
         case 1:
            return (
               <>
                  <div className={classes.container}>
                     <form
                        onSubmit={handleSubmit}
                        className={`${classes.form} ${
                           isFetching ? "opacity-60 pointer-events-none" : ""
                        }`}
                     >
                        <div className="mt-0 md:mt-[-50px] text-center md:text-left">
                           <h1 className={classes.myChat}>
                              HD <span className="text-[#cd1818]">Mobile</span>
                           </h1>
                           <h1 className="text-[32px] mt-[10px] text-[#1f1f1f]">
                              Welcome
                           </h1>
                        </div>
                        <div className={classes.right}>
                           <div className={`${classes.inputGroup} pt-[8px]`}>
                              <label className={classes.label} htmlFor="username">
                                 Username
                              </label>
                              <input
                                 ref={inputRef}
                                 className={`${classes.input} disable`}
                                 value={"admin"}
                                 readOnly
                                 id="username"
                                 type="text"
                              />
                           </div>
                           <div className={classes.inputGroup}>
                              <label className={classes.label} htmlFor="password">
                                 Password
                              </label>
                              <input
                                 className={classes.input}
                                 value={password}
                                 onChange={(e) => setPassword(e.target.value)}
                                 type="text"
                                 id="password"
                                 autoComplete="off"
                                 required
                              />
                           </div>
                        </div>
                     </form>
                  </div>

                  <Button
                     colors={"third"}
                     disabled={!ableToSubmit}
                     loading={isFetching}
                     onClick={handleSubmit}
                     className="!absolute bottom-[60px]"
                  >
                     Submit
                  </Button>
               </>
            );
         case 2:
            return (
               <>
                  <h1 className="text-[40px] font-[500] text-[#333]">Finish</h1>
                  <Button
                     colors={"third"}
                     className={"!absolute bottom-[60px]"}
                     to="/dashboard"
                  >
                     Go to Dashboard
                  </Button>
               </>
            );
      }
   }, [step, password, isFetching]);

   useEffect(() => {
      if (step === 1) {
         inputRef.current?.focus();
      }
   }, [step]);

   return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f0f4f9]">
         {renderStep}
      </div>
   );
}
