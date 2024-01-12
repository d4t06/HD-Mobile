import { Button } from "@/components";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

type Props = {
   setIsOpenSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function MobileHeader({ setIsOpenSidebar }: Props) {
   // const [scroll, setScroll] = useState(0);

   // const handleScroll = () => {
   //    const scrollTop = window.scrollY;
   //    setScroll(scrollTop);
   // };

   // useEffect(() => {
   //    window.addEventListener("scroll", handleScroll);
   //    return () => {
   //       window.removeEventListener("scroll", handleScroll);
   //    };
   // }, []);

   const classes = {
      container: "relative justify-center items-center h-[50px] hidden max-[768px]:flex",
   };

   return (
      <>
         <div className={`${classes.container}`}>
            <Button onClick={() => setIsOpenSidebar(true)} className="absolute left-0">
               <i className="material-icons text-[30px]">menu</i>
            </Button>
            <Link className="text-[20px]" to={"/"}>
               HD <span className="text-[#cd1818]">Mobile</span>
            </Link>
         </div>
      </>
   );
}
