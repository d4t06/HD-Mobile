import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { moneyFormat } from "../../utils/appHelper";
import classNames from "classnames/bind";
import styles from "./Search.module.scss";
import useDebounce from "../../hooks/useDebounce";
import Popup from "../ui/Popup";

import {
   ArrowPathIcon,
   MagnifyingGlassIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";
import { Modal } from "..";
import useSearchProduct from "@/hooks/useSearchProduct";
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
   const [show, setShow] = useState(false);

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
      setShow(false);

      let prefix = "";

      switch (props.variant) {
         case "home":
            prefix = "/product";
            break;
         case "dashboard":
            prefix = "/dashboard/product";
            break;
      }

      navigate(`${prefix}/${item.product_ascii}`);
   };

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();

      if (props.variant === "dashboard") return;

      if (!searchKey) return;

      setSearchKey("");
      setShow(false);
      props.closeSidebar();

      navigate(`/search/${searchKey}`);
   };

   const isShowResult = show && !!searchResult.length;

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
                                    <img src={p.image_url} alt="" />
                                 </div>
                                 <div className={cx("product-info")}>
                                    <h2 className={cx("title")}>{p.product}</h2>
                                    <p className={cx("price")}>
                                       {moneyFormat(
                                          p.default_variant.variant.default_combine
                                             .combine.price || ""
                                       )}
                                       ₫
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
               placement: props.variant === 'home' ? 'auto' : "bottom-start"
            }}
         >
            <div className={cx("wrap")}>
               <form className={cx("form")} onSubmit={handleSubmit}>
                  <input
                     className={cx("input")}
                     type="text"
                     placeholder="iPhone 15..."
                     value={searchKey}
                     onChange={(e) => handleSearchText(e)}
                     onFocus={() => setShow(true)}
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

         {props.variant !== 'dashboard' && show && <Modal z="z-[10]" closeModal={() => setShow(false)} />}
      </>
   );
}
export default Search;
