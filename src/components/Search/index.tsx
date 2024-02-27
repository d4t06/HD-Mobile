import { Dispatch, FormEvent, SetStateAction, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { moneyFormat } from "../../utils/appHelper";
import classNames from "classnames/bind";
import styles from "./Search.module.scss";
import searchService from "../../services/searchService";
import useDebounce from "../../hooks/useDebounce";
import Popup from "../ui/Popup";
import { Product } from "@/types";
import { ArrowPathIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const cx = classNames.bind(styles);

type Props = {
   setShowModal?: Dispatch<SetStateAction<boolean>>;
   setOpenSidebar?: Dispatch<SetStateAction<boolean>>;
};

function Search({ setShowModal,setOpenSidebar }: Props) {
   const [loading, setLoading] = useState(false);
   const [query, setQuery] = useState("");
   const [searchResult, setSearchResult] = useState<Product[]>([]);
   const [show, setShow] = useState(false);
   const [someThingToAbortApi, setSomeThingToAbortApi] = useState(0);

   // use hooks
   let debounceValue = useDebounce(query, 1000);
   const navigate = useNavigate();

   const handleSearchText = (e: any) => {
      handleShow(true);
      setSomeThingToAbortApi(0);
      setQuery(e.target.value);
      if (!query) setSearchResult([]);
   };

   const handleClear = (e: any) => {
      e.stopPropagation();
      setQuery("");
      debounceValue = "";
      setSearchResult([]);
   };

   const handleShow = (value: any) => {
      setShow(value);
      setShowModal && setShowModal(value);
      setOpenSidebar && setOpenSidebar(false)
   };

   const handleDetailPage = (item: Product) => {
      handleShow(false);
      navigate(`/${item.category_data.category_name_ascii}/${item.product_name_ascii}`);
   };

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();

      if (!query) return;
      setSomeThingToAbortApi(Math.random());
      handleShow(false);
      navigate(`/search/${query}`);
   };

   const isShowResult = useMemo(() => !!query && !!searchResult && !!show, [show, searchResult, query]);

   useEffect(() => {
      if (!debounceValue.trim()) return;
      const controller = new AbortController();

      const fetchApi = async () => {
         try {
            console.log("get data");
            setLoading(true);
            const result = await searchService({ q: debounceValue, category_id: undefined }, controller.signal);

            if (result) {
               setSearchResult(result);
            }
         } catch (error) {
            console.log(error);
         } finally {
            setLoading(false);
         }
      };

      if (!someThingToAbortApi) fetchApi();

      return () => {
         console.log("abort");

         controller.abort();
         setLoading(false);
      };
   }, [debounceValue, someThingToAbortApi]);

   // return;
   return (
      <Popup
         content={
            <div className={cx("search-result")}>
               <ul>
                  {searchResult.length &&
                     searchResult?.map((p, index) => {
                        return (
                           <li onClick={() => handleDetailPage(p)} className={cx("product")} key={index}>
                              <div className={cx("product-img")}>
                                 <img src={p.image_url} alt="" />
                              </div>
                              <div className={cx("product-info")}>
                                 <h2 className={cx("title")}>{p.product_name}</h2>
                                 <p className={cx("price")}>{moneyFormat(p.combines_data[0].price)}₫</p>
                              </div>
                           </li>
                        );
                     })}
               </ul>
            </div>
         }
         opts={{
            visible: isShowResult && !!searchResult.length,
            appendTo: () => document.body,
            onClickOutside: () => handleShow(false),
         }}
      >
         <div className={cx("wrap")}>
            <form className={cx("form")} onSubmit={handleSubmit}>
               <input
                  className={cx("input")}
                  type="text"
                  placeholder="Hôm nay bạn muốn tìm gì..."
                  value={query}
                  onChange={(e) => handleSearchText(e)}
                  onFocus={() => handleShow(true)}
               />
               {loading && query && (
                  <button className={cx("loading-btn", "btn")}>
                     <ArrowPathIcon className="w-[24px] animate-spin" />
                  </button>
               )}
               {!loading && query && (
                  <button type="button" className={cx("clear-btn", "btn")} onClick={(e) => handleClear(e)}>
                     <XMarkIcon className="w-[24px]" />
                  </button>
               )}
               <button type="submit" className={cx("search-btn", "btn")}>
                  <MagnifyingGlassIcon className="w-[24px]" />
               </button>
            </form>
         </div>
      </Popup>
   );
}
export default Search;
