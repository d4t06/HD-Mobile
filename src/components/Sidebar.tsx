import { useApp } from "@/store/AppContext";
import { Dispatch, SetStateAction } from "react";
import { Avatar, Button, Modal } from ".";
import { Link } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Sidebar({ isOpen, setIsOpen }: Props) {
  const { categories } = useApp();
  const { auth } = useAuth();

  const classes = {
    container: `fixed z-[999] top-0 left-0 bottom-0 w-[260px] max-w-[60vw] bg-[#f1f1f1] hidden max-[768px]:block transition-[transform, opacity] duration-[.3s]`,
    open: "translate-x-0 opacity-[1]",
    hide: "translate-x-[-100%] opacity-[.5]",
    closeBtn: "absolute right-[10px] top-[10px]",
  };

  return (
    <>
      <div className={`${classes.container} ${isOpen ? classes.open : classes.hide}`}>
        <div className="text-white relative p-[14px] bg-[#cd1818]">
          <Avatar />
          <Button onClick={() => setIsOpen(false)} className={classes.closeBtn}>
            <i className="material-icons text-[30px] mr-[8px]">close</i>
          </Button>
        </div>
        <ul className="py-[14px] px-[10px]">
          {categories.map((c, index) => (
            <Link
              onClick={() => setIsOpen(false)}
              key={index}
              to={`/${c.category_ascii}`}
              className="flex items-center  h-[40px] text-[#333]"
            >
              <i className="material-icons text-[25px] mr-[8px]">{c.icon}</i>
              <span className="text-[16px] font-[500]">{c.category_name}</span>
            </Link>
          ))}

          {auth?.token && (
            <Link
              onClick={() => setIsOpen(false)}
              to={`/account`}
              className="flex items-center  h-[40px] text-[#333]"
            >
              <i className="material-icons text-[25px] mr-[8px]">account_circle</i>
              <span className="text-[16px] font-[500]">My account</span>
            </Link>
          )}
        </ul>
      </div>

      {isOpen && <Modal z="z-[200]" setShowModal={setIsOpen} />}
    </>
  );
}
