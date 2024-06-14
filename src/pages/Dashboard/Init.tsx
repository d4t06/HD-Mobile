import { useMemo, useState } from "react";
import { Button } from "@/components";

// const INIT_URL = `${
//    import.meta.env.VITE_API_ENDPOINT || "https://spring-mobile-latest.onrender.com/api"
// }/init`;

export default function Init() {
   const [step, setStep] = useState(0);

   const [password, setPassword] = useState("");

   const next = () => setStep((prev) => (prev = prev + 1));

   const handleSubmit = async () => {};

   const renderContent = useMemo(() => {
      switch (step) {
         case 0:
            return (
               <>
                  <h1 className="text-[40px] font-[500] text-[#333]">Welcome</h1>
                  <Button onClick={next} className="!absolute bottom-[60px]">
                     Next
                  </Button>
               </>
            );
         case 1:
            return (
               <form
                  className={`rounded-[14px] bg-white space-y-[20px]`}
                  onSubmit={handleSubmit}
               >
                  <h1 className={"text-[30px]"}>
                     <span className="text-[#cd1818">HD</span>
                     Mobile
                  </h1>
                  <div className={``}>
                     <label htmlFor="username">Tên tài khoản</label>

                     <input
                        className="disable"
                        id="username"
                        autoComplete="off"
                        type="text"
                        value={"admin"}
                        aria-describedby="note"
                     />
                  </div>
                  <div className={``}>
                     <label htmlFor="password">Mật khẩu</label>
                     <input
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
               </form>
            );
         case 2:
            return (
               <>
                  <h1 className="text-[40px] font-[500] text-[#333]">Done !</h1>
                  <Button to="/login" className="!absolute bottom-[60px]">
                     Go to dashboard
                  </Button>
               </>
            );
      }
   }, [step]);

   return (
      <div className="flex items-center justify-center h-screen w-full">
         {renderContent}
      </div>
   );
}
