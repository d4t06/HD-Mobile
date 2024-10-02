import { useAuth } from "@/store/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "@/routes";
import { ArrowRightStartOnRectangleIcon, UserIcon } from "@heroicons/react/24/outline";
import useLogout from "@/hooks/useLogout";
import Modal from "../Modal";
import ConfirmModal from "../Modal/Confirm";
import { useState } from "react";

export default function Avatar() {
   const { auth, loading } = useAuth();

   const [isOpenModal, setIsOpenModal] = useState(false);

   const navigate = useNavigate();

   const closeModal = () => {
      setIsOpenModal(false);
   };

   const { logout, isFetching } = useLogout();

   const handleLogout = async () => {
      await logout();

      navigate("/");

      closeModal();
   };

   return (
      <>
         <div className="flex items-center justify-end space-x-1">
            {!loading && (
               <>
                  {auth?.username ? (
                     <>
                        <h5 className="font-medium">{auth.username}</h5>

                        <button
                           className="hover:text-[#cd1818]"
                           onClick={() => setIsOpenModal(true)}
                        >
                           <ArrowRightStartOnRectangleIcon className="w-6" />
                        </button>
                     </>
                  ) : (
                     <>
                        <Link
                           className="font-medium flex space-x-1 hover:text-[#cd1818]"
                           to={routes.LOGIN}
                        >
                           Sign In
                        </Link>
                        <UserIcon className="w-6" />
                     </>
                  )}
               </>
            )}
         </div>

         {isOpenModal && (
            <Modal zIndexClass="z-[999]" closeModal={closeModal}>
               <ConfirmModal
                  callback={handleLogout}
                  closeModal={closeModal}
                  loading={isFetching}
                  label="Sign out ?"
               />
            </Modal>
         )}
      </>
   );
}
