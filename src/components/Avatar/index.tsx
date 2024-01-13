import classNames from "classnames/bind";
import styles from "./Avatar.module.scss";
import { useAuth } from "@/store/AuthContext";
import jwtDecode from "jwt-decode";
import Skeleton from "../Skeleton";
import { Link, useMatch } from "react-router-dom";
import { routes } from "@/routes";
import defaultUser from "@/assets/images/user-default.png";
import Image from "../ui/Image";
import { Button } from "..";
import { useMemo } from "react";

const cx = classNames.bind(styles);

type Decode = { username: string; role?: string };

const initRole = { username: "", role: "" };

export default function Avatar({ revert }: { revert?: boolean }) {
  const { auth, loading } = useAuth();

  const decode: Decode = useMemo(
    () => (auth?.token ? jwtDecode(auth.token) : initRole),
    [auth]
  );

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
            {decode.username ? (
              <Link to="/account">
                <div className={cx("avatar-placeholder")}>
                  {decode.username.charAt(0) || ""}
                </div>
              </Link>
            ) : (
              <Image classNames="rounded-full" src={defaultUser} />
            )}
          </div>

          {decode.username ? (
            <h5 className={cx("user-name")}>{decode.username}</h5>
          ) : (
            <Link to={routes.LOGIN}>
              <Button>Đăng nhập</Button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export function AvatarPlaceholder({ firstChar }: { firstChar: string }) {
  return (
    <div className={cx("image-frame")}>
      <div className={cx("avatar-placeholder")}>
        <p>{firstChar}</p>
      </div>
    </div>
  );
}
