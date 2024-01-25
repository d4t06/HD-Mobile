import { useAuth } from "@/store/AuthContext";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Modal, Avatar } from "@/components";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { useApp } from "@/store/AppContext";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "./MobileHeader";
const cx = classNames.bind(styles);

function Header() {
  const { auth } = useAuth();
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // use hooks
  const location = useLocation();
  const { categories, initLoading } = useApp();

  const cartItemCount = useMemo(
    () => JSON.parse(localStorage.getItem("carts") || "0") as number,
    []
  );

  const renderCategories = useMemo(() => {
    if (!categories.length) return <h1>Not category found</h1>;
    return categories.map((cat, index) => (
      <li
        key={index}
        className={cx("nav-item", {
          active: !showModal && location.pathname === `/${cat.category_ascii}`,
        })}
      >
        <Link to={`/${cat.category_ascii}`}>
          <i className="material-icons">{cat.icon}</i>
          <p className={cx("nav-text")}>{cat.category_name}</p>
        </Link>
      </li>
    ));
  }, [categories, location, showModal]);

  return (
    <>
      <div className={cx("header")}>
        <div className={cx("header-banner")}>
          <img
            src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2024/01/banner/Big-steak-1200-44-1200x44.png"
            alt=""
          />
        </div>
        <div className="container">
          {/* mobile header */}
          <MobileHeader setIsOpenSidebar={setIsOpenSidebar} />

          <div className={cx("header-top")}>
            <div className={cx("header-top-wrap")}>
              <div className="left w-1/4 max-[768px]:hidden">
                <Link className={cx("brand")} to={"/"}>
                  HD <span className="text-[#cd1818]">Mobile</span>
                </Link>
              </div>
              <Search setShowModal={setShowModal} />

              <div className="w-1/4 max-[768px]:hidden">
                <Avatar revert />
              </div>
            </div>
          </div>
          <div className={cx("header-nav")}>
            <div className={cx("header-nav-wrap")}>
              {/* render categories */}
              <ul className={cx("nav-list")}>{!initLoading && renderCategories}</ul>
              <ul className={cx("nav-list")}>
                <li className={cx("nav-item")}>
                  <Link to={"/check-out"}>
                    <p className={cx("nav-text")}>Cart({cartItemCount})</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-[24px]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                  </Link>
                </li>
                {auth?.role === "ADMIN" && (
                  <li className={cx("nav-item")}>
                    <Link to={"/dashboard"}>
                      <p className={cx("nav-text")}>Dashboard</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-[24px]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Sidebar isOpen={isOpenSidebar} setIsOpen={setIsOpenSidebar} />

      {showModal && <Modal setShowModal={setShowModal}></Modal>}
    </>
  );
}
export default Header;
