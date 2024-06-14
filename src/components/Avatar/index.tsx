import classNames from "classnames/bind";
import styles from "./Avatar.module.scss";
import { useAuth } from "@/store/AuthContext";
import Skeleton from "../Skeleton";
import { Link } from "react-router-dom";
import { routes } from "@/routes";
import defaultUser from "@/assets/images/user-default.png";
import Image from "../ui/Image";

const cx = classNames.bind(styles);

export default function Avatar({ revert }: { revert?: boolean }) {
   const { auth, loading } = useAuth();

   return (
      <div className={cx("user-cta", { revert })}>
         {loading && (
            <>
               <Skeleton className="h-[44px] w-[44px] rounded-full" />
               <Skeleton className="h-[24px] w-[100px] rounded-[4px]" />
            </>
         )}
         {!loading && (
            <>
               <div className={cx("image-frame")}>
                  {auth?.username ? (
                     <Link to="/account">
                        <div className={cx("avatar-placeholder")}>
                           <p>{auth.username.charAt(0).toUpperCase() || ""}</p>
                        </div>
                     </Link>
                  ) : (
                     <Image classNames="rounded-full" src={defaultUser} />
                  )}
               </div>

               {auth?.username ? (
                  <h5 className={cx("user-name")}>{auth.username}</h5>
               ) : (
                  <Link
                     to={routes.LOGIN}
                  >
                     Đăng nhập
                  </Link>
               )}
            </>
         )}
      </div>
   );
}

export function AvatarPlaceholder({
   firstChar,
   image_url,
}: {
   firstChar: string;
   image_url?: string;
}) {
   return (
      <div className={cx("image-frame", "bg-white")}>
         {image_url ? (
            <img src={image_url} className="w-full h-full rounded-full" alt="" />
         ) : (
            <div className={cx("avatar-placeholder")}>
               <p>{firstChar}</p>
            </div>
         )}
      </div>
   );
}
