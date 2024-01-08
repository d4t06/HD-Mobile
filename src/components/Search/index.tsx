import { Dispatch, FormEvent, SetStateAction, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { moneyFormat } from "../../utils/appHelper";
import classNames from "classnames/bind";
import styles from "./Search.module.scss";
import searchService from "../../services/searchService";
import useDebounce from "../../hooks/useDebounce";
import Popup from "../ui/Popup";
import { Product } from "@/types";

const cx = classNames.bind(styles);
// const  = classNames.bind(PopupStyles);

type Props = {
   setShowModal?: Dispatch<SetStateAction<boolean>>;
};

function Search({ setShowModal }: Props) {
   const [loading, setLoading] = useState(false);
   const [query, setQuery] = useState("");
   const [searchResult, setSearchResult] = useState<{ products: Product[] }>();
   const [show, setShow] = useState(false);
   const [someThingToAbortApi, setSomeThingToAbortApi] = useState(0);

   // use hooks
   let debounceValue = useDebounce(query, 1000);
   const navigate = useNavigate();

   const handleSearchText = (e: any) => {
      handleShow(true);
      setSomeThingToAbortApi(0)
      setQuery(e.target.value);
      if (!query) setSearchResult(undefined);
   };

   const handleClear = (e: any) => {
      e.stopPropagation();
      setQuery("");
      debounceValue = "";
      setSearchResult(undefined);
   };

   const handleShow = (value: any) => {
      setShow(value);
      setShowModal && setShowModal(value);
   };

   const handleDetailPage = (item: any) => {
      handleShow(false);
      navigate(`/${item.category_name}/${item.product_id}`);
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
               <h2 className={cx("search-result-title")}>Sản phẩm được gợi ý</h2>
               <ul>
                  {searchResult &&
                     searchResult?.products.map((p, index) => {
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
            visible: isShowResult,
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
                  // onKeyDown={(e) => {
                  //    e.key === "Enter" && handleSubmit();
                  // }}
               />
               {loading && query && (
                  <button className={cx("loading-btn", "btn")}>
                     <i className="material-icons">sync</i>
                  </button>
               )}
               {!loading && query && (
                  <button type="button" className={cx("clear-btn", "btn")} onClick={(e) => handleClear(e)}>
                     <i className="material-icons">clear</i>
                  </button>
               )}
               <button type="submit" className={cx("search-btn", "btn")}>
                  <i className="material-icons">search</i>
               </button>
            </form>
         </div>
      </Popup>
   );
}
export default Search;
