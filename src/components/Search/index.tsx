import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { moneyFormat } from "../../utils/appHelper";
import classNames from "classnames/bind";
import styles from "./Search.module.scss";
import useDebounce from "../../hooks/useDebounce";
import Popup from "../ui/Popup";
import simonCat from "@/assets/images/not-found.png";

import {
   ArrowPathIcon,
   MagnifyingGlassIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";
import { Modal } from "..";
import useSearchProduct from "@/hooks/useSearchProduct";
import { ModalRef } from "../Modal";
const cx = classNames.bind(styles);

type Home = {
   closeSidebar: () => void;
   variant: "home";
};

type Dashboard = {
   variant: "dashboard";
};

type Props = Home | Dashboard;

function Search(props: Props) {
   const [searchKey, setSearchKey] = useState("");
   const [isShow, setIsShow] = useState(false);

   const modalRef = useRef<ModalRef>(null);

   // use hooks
   const debounceValue = useDebounce(searchKey, 1000);
   const { isFetching, searchResult, setSearchResult } = useSearchProduct({
      query: debounceValue,
   });

   const navigate = useNavigate();

   const handleSearchText = (e: any) => {
      setSearchKey(e.target.value);
      if (!searchKey) setSearchResult([]);
   };

   const handleClear = (e: any) => {
      e.stopPropagation();
      setSearchKey("");
      setSearchResult([]);
   };

   const handleNavigate = (item: ProductSearch) => {
      modalRef.current?.close();

      let prefix = "";

      switch (props.variant) {
         case "home":
            prefix = "/product";
            break;
         case "dashboard":
            prefix = "/dashboard/product";
            break;
      }

      navigate(`${prefix}/${item.id}`);
   };

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();

      if (props.variant === "dashboard") return;

      if (!searchKey) return;

      setSearchKey("");
      modalRef.current?.close();
      props.closeSidebar();

      navigate(`/search/${searchKey}`);
   };

   const isShowResult = !!searchResult.length && isShow;

   // return;
   return (
      <>
         <Popup
            content={
               <div className={cx("search-result", props.variant)}>
                  <ul>
                     {searchResult.length &&
                        searchResult?.map((p, index) => {
                           return (
                              <li
                                 onClick={() => handleNavigate(p)}
                                 className={cx("product")}
                                 key={index}
                              >
                                 <div className={cx("product-img")}>
                                    <img src={p.image_url || simonCat} alt="" />
                                 </div>
                                 <div className={cx("product-info")}>
                                    <h2>{p.name}</h2>
                                    <p className={cx("price")}>
                                       {p?.default_variant?.variant?.default_combine
                                          ? moneyFormat(
                                               p.default_variant.variant.default_combine
                                                  ?.combine?.price || "",
                                            ) + "₫"
                                          : "Contact"}
                                    </p>
                                 </div>
                              </li>
                           );
                        })}
                  </ul>
               </div>
            }
            opts={{
               visible: isShowResult,
               appendTo: () => document.body,
               placement: props.variant === "home" ? "auto" : "bottom-start",
               onClickOutside: () => {
                  setIsShow(false);
               },
            }}
         >
            <div
               className={`${cx("wrap")} ${props.variant === "dashboard" ? "z-[0]" : "z-[999]"}`}
            >
               <form className={cx("form")} onSubmit={handleSubmit}>
                  <input
                     className={cx("input")}
                     type="text"
                     placeholder="iPhone 15..."
                     value={searchKey}
                     onChange={(e) => handleSearchText(e)}
                     onFocus={() => {
                        modalRef.current?.open(), setIsShow(true);
                     }}
                  />
                  {isFetching && searchKey && (
                     <button className={cx("loading-btn", "btn")}>
                        <ArrowPathIcon className="w-[24px] animate-spin" />
                     </button>
                  )}
                  {!isFetching && searchKey && (
                     <button
                        type="button"
                        className={cx("clear-btn", "btn")}
                        onClick={(e) => handleClear(e)}
                     >
                        <XMarkIcon className="w-[24px]" />
                     </button>
                  )}
                  <button type="submit" className={cx("search-btn", "btn")}>
                     <MagnifyingGlassIcon className="w-[24px]" />
                  </button>
               </form>
            </div>
         </Popup>

         {props.variant !== "dashboard" && <Modal ref={modalRef} variant="animation" />}
      </>
   );
}
export default Search;
