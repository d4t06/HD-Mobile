import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { moneyFormat } from "@/utils/appHelper";

import { Button, Input, Modal, QuickFilter } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, getMoreProducts, selectedAllFilter, selectedAllProduct, storingFilters } from "@/store";
import { AppDispatch } from "@/store/store";
import Table from "@/components/Table";
import { Category, Product } from "@/types";
import AddProductModal from "@/components/Modal/AddProductModal";
import { useApp } from "@/store/AppContext";
import useAppConfig from "@/hooks/useAppConfig";

type ModelTarget = "Add" | "Edit";

export default function Dashboard() {
   const dispatch = useDispatch<AppDispatch>();

   const [isOpenModal, setIsOpenModal] = useState(false);
   const [curCategory, setCurCategory] = useState<Category>();

   const curPro = useRef<Product & { curIndex: number }>();
   const firstTimeRender = useRef(true);
   const openModalTarget = useRef<ModelTarget | "">("");

   // hooks
   const {
      page,
      productState: { count, products },
      status,
      category_id,
   } = useSelector(selectedAllProduct);
   const { filters, sort } = useSelector(selectedAllFilter);
   const { categories } = useApp();
   const { status: appConfigStatus, curBrands } = useAppConfig({ curCategory, autoRun: true, admin: true });

   const ranEffect = useRef(false);

   const remaining = useMemo(() => count - products.length, [products]);

   const handleGetMore = () => {
      // if (!curCategory) return;
      dispatch(getMoreProducts({ category_id, sort, filters, page: page + 1, admin: true }));
   };

   const handleOpenModal = (type: ModelTarget, product?: Product & { curIndex: number }) => {
      curPro.current = product;
      openModalTarget.current = type;
      setIsOpenModal(true);
   };

   const renderProducts = (
      <Table colList={["Tên", "Bộ nhớ", "Màu sắc", "Giá", "Kho", "Trả góp", ""]}>
         {status !== "loading" && (
            <>
               {!!products.length ? (
                  <>
                     {products.map((productItem, index) => {
                        return (
                           <tr key={index}>
                              <td>{productItem.product_name}</td>
                              {/* loop here */}
                              <td>
                                 {productItem.combines_data.map((item, index) => (
                                    <span key={index}>
                                       {item.storage_data?.storage}
                                       <br className="my-[10px]" />
                                    </span>
                                 ))}
                              </td>
                              <td>
                                 {productItem.combines_data.map((cb, index) => (
                                    <span key={index}>
                                       {cb.color_data?.color}
                                       <br className="my-[10px]" />
                                    </span>
                                 ))}
                              </td>

                              <td>
                                 {productItem.combines_data.map((cb, index) => (
                                    <span key={index}>
                                       {moneyFormat(cb.price)} đ
                                       <br className="my-[10px]" />
                                    </span>
                                 ))}
                              </td>
                              <td>
                                 {productItem.combines_data.map((cb, index) => (
                                    <span key={index}>
                                       {cb.quantity}
                                       <br className="my-[10px]" />
                                    </span>
                                 ))}
                              </td>
                              <td>{productItem.installment ? "Yes" : ""}</td>
                              <td>
                                 <div className="flex gap-[6px]">
                                    <Button
                                       onClick={() => handleOpenModal("Edit", { ...productItem, curIndex: index })}
                                       circle
                                       className="bg-black/10 hover:bg-[#cd1818] hover:text-white"
                                    >
                                       <i className="material-icons">edit</i>
                                    </Button>
                                    <Link to={`product/edit/${productItem.product_name_ascii}`}>
                                       <Button circle className="bg-black/10 hover:bg-[#cd1818] hover:text-white">
                                          <i className="material-icons">settings</i>
                                       </Button>
                                    </Link>
                                 </div>
                              </td>
                           </tr>
                        );
                     })}
                  </>
               ) : (
                  <tr>
                     <td>
                        <h1>No product jet...</h1>
                     </td>
                  </tr>
               )}
            </>
         )}
      </Table>
   );

   const renderModal = useMemo(() => {
      if (!isOpenModal) return;
      switch (openModalTarget.current) {
         case "Add":
            return <AddProductModal openType="Add" curCategory={curCategory} setIsOpenModalParent={setIsOpenModal} />;
         case "Edit":
            return (
               <AddProductModal
                  openType="Edit"
                  curCategory={curCategory}
                  curProduct={curPro.current}
                  setIsOpenModalParent={setIsOpenModal}
               />
            );
         default:
            return <h1 className="text-2xl">Noting to show</h1>;
      }
   }, [isOpenModal, curCategory]);

   useEffect(() => {
      if (!ranEffect.current)
         dispatch(fetchProducts({ category_id: curCategory?.id || undefined, filters, page: 1, sort, admin: true }));

      return () => {
         dispatch(storingFilters());
         ranEffect.current = true;
      };
   }, [curCategory]);

   useEffect(() => {
      if (!categories.length) return;

      if (firstTimeRender.current) {
         firstTimeRender.current = false;
         setCurCategory(categories[0]);
      }
   }, []);

   const classes = {
      button: "border-b-[4px] py-[4px] px-[16px] hover:brightness-100",
      disableButton: "border-transparent text-[20px] hover:border-[#cd1818]",
      activeButton: "border-[#cd1818] text-[30px]",
   };

   // console.log('check cur brands', curBrands, appConfigStatus);

   if (status === "error") return <h1 className="text-2xl">Some thing went wrong</h1>;

   return (
      <>
         <div className="flex gap-[8px] mb-[10px]">
            <Button
               onClick={() => setCurCategory(undefined)}
               className={`${classes.button} ${
                  curCategory === undefined ? classes.activeButton : classes.disableButton
               }`}
            >
               All
            </Button>
            {categories.map((cat, index) => {
               const active = curCategory?.category_ascii === cat.category_ascii;
               return (
                  <Button
                     key={index}
                     onClick={() => setCurCategory(cat)}
                     className={`${classes.button} ${active ? classes.activeButton : classes.disableButton}`}
                  >
                     {cat.category_name}
                     {status === "successful" && active && " (" + count + ")"}
                  </Button>
               );
            })}
         </div>

         {curCategory && (
            <QuickFilter curCategory={curCategory} admin loading={appConfigStatus === "loading"} brands={curBrands} />
         )}

         <div className="flex items-center justify-between mt-[10px]">
            <div className="flex items-start">
               <Input placeholder="Product..." cb={(key) => console.log(key)} />
               <p className="ml-[8px]">
                  <Button primary>Tìm</Button>
               </p>
            </div>

            <Button onClick={() => handleOpenModal("Add")} primary>
               <i className="material-icons mr-[4px]">add</i>
               Thêm sản phẩm
            </Button>
         </div>

         <div className="mt-[30px]">
            {renderProducts}
            {status === "loading" && <h1 className="text-3xl text-center">Loading...</h1>}
            {status !== "loading" && !!products.length && (
               <p className="text-center my-[15px]">
                  <Button
                     disable={remaining <= 0 || status === "more-loading"}
                     primary
                     isLoading={status === "more-loading"}
                     onClick={() => handleGetMore()}
                  >
                     Xem thêm ({remaining <= 0 ? 0 : remaining}) sản phẩm
                  </Button>
               </p>
            )}
         </div>

         {isOpenModal && <Modal setShowModal={setIsOpenModal}>{renderModal}</Modal>}
      </>
   );
}
