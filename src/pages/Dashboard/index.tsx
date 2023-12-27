import classNames from "classnames/bind";
import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { moneyFormat } from "@/utils/appHelper";

import styles from "./Dashboard.module.scss";
import { Button, Sort } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, getMoreProducts, selectedAllFilter, selectedAllProduct } from "@/store";
import { AppDispatch } from "@/store/store";
import { Tabs } from "@/components";
import Table from "@/components/Table";
import { ProductCombine } from "@/types";
const cx = classNames.bind(styles);

interface ProductCombineAdmin extends ProductCombine {
   color_data: {
      color: string;
   };
   storage_data: {
      storage: string;
   };
}

function Dashboard() {
   const dispatch = useDispatch<AppDispatch>();
   const privateRequest = usePrivateRequest();

   const {
      page,
      productState: { count, products },
      status,
   } = useSelector(selectedAllProduct);

   const { filters, sort } = useSelector(selectedAllFilter);
   const firstTimeRender = useRef(true);

   const [category, setCategory] = useState<"dtdd" | "laptop">("dtdd");

   const remaining = useMemo(() => count - products.length, [products]);

   const handleGetMore = () => {
      if (!category) return;
      dispatch(getMoreProducts({ category, sort, filters, page: page + 1 }));
   };

   const handleDeleteProduct = async (product_name_ascii: string) => {
      try {
         await privateRequest.get(`/product-management/delete/${product_name_ascii}`);
         console.log("delete success");
      } catch (error) {
         console.log({ message: error });
      }
   };

   const renderProducts = (
      <Table colList={["Name", "Storage", "Color", "Price", "Quantity", "Installment", ""]}>
         {products.map((productItem, index) => {
            if (!productItem.combines_data.length)
               return (
                  <tr key={index}>
                     <td>{productItem.product_name}</td>
                     <td colSpan={5}></td>
                     <td>
                        <button>
                           <i className="material-icons">edit</i>
                        </button>
                        <Link to={`product/edit/${productItem.product_name_ascii}`}>
                           <i className="material-icons">settings</i>
                        </Link>
                     </td>
                  </tr>
               );

            return productItem.combines_data.map((item) => (
               <tr>
                  <td>{productItem.product_name}</td>
                  <td>{item.storage_data!.storage}</td>
                  <td>{item.color_data!.color}</td>
                  <td>{moneyFormat(item.price)}đ</td>
                  <td>{item.quantity}</td>
                  <td>{productItem.installment ? "Yes" : ""}</td>
                  {/* <td>{defaultPrice ? moneyFormat(defaultPrice) + "đ" : "Call"}</td> */}
                  <td>
                     <div className="flex gap-[6px]">
                        <Button circle className="bg-black/10 hover:bg-[#cd1818] hover:text-white">
                           <i className="material-icons">edit</i>
                        </Button>
                        <Link to={`product/edit/${item.product_name_ascii}`}>
                           <Button circle className="bg-black/10 hover:bg-[#cd1818] hover:text-white">
                              <i className="material-icons">settings</i>
                           </Button>
                        </Link>
                        <Button circle className="bg-black/10 hover:bg-[#cd1818] hover:text-white">
                           <i className="material-icons">delete</i>
                        </Button>
                     </div>
                  </td>
               </tr>
            ));
         })}
      </Table>
   );

   useEffect(() => {
      if (firstTimeRender.current) {
         dispatch(fetchProducts({ category, filters, page: 1, sort, admin: true }));
      }

      return () => {
         firstTimeRender.current = false;
      };
   }, [category]);

   return (
      <div className={cx("product-body")}>
         <Tabs setActiveTab={setCategory} activeTab={category} tabs={["dtdd", "laptop"]} render={(item) => item} />

         <div className={cx("product-container")}>
            <div className="row">
               {status !== "loading" && <>{!!products.length ? renderProducts : <h1>No product jet</h1>}</>}
               {(status === "loading" || status === "more-loading") && <h1>loading...</h1>}
            </div>
            {status !== "loading" && !!products.length && (
               <div className={cx("pagination", { disable: remaining === 0 })}>
                  <Button sNormal primaryCl loading={status === "more-loading"} onClick={() => handleGetMore()}>
                     Xem thêm {count} sản phẩm
                  </Button>
               </div>
            )}
         </div>
      </div>
   );
}
export default Dashboard;
