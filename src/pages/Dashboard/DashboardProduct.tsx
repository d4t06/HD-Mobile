import { useState, useMemo } from "react";
import { Button } from "@/components";
import Table from "@/components/Table";

import { ArrowPathIcon } from "@heroicons/react/16/solid";
import useDashBoardProduct from "./_hooks/useDashboardProduct";
import DashboardProductCta from "@/components/DashboardProductCta";

import AddProductBtn from "./_components/AddProductBtn";
import DashboardSearch from "./_components/DashboardSearch";
import { Link } from "react-router-dom";

export default function Dashboard() {
   // const [curCategory, setCurCategory] = useState<Category>();

   const [tab, setTab] = useState("");

   // hooks
   const { categories, getMore, count, products, status } = useDashBoardProduct({
      tab,
   });

   const remaining = useMemo(() => count - products.length, [products]);

   const handleGetMore = () => {
      getMore();
   };

   const renderProducts = (
      <Table className="[&_th]:text-left" colList={[`Results (${count})`, ""]}>
         {status !== "loading" && (
            <>
               {!!products.length ? (
                  <>
                     {products.map((p, index) => {
                        return (
                           <tr key={index}>
                              <td>
                                 <Link
                                    className="hover:underline"
                                    to={`/dashboard/product/${p.id}`}
                                 >
                                    {p.name}
                                 </Link>
                              </td>
                              {/* loop here */}
                              <td className="!text-right">
                                 <DashboardProductCta index={index} product={p} />
                              </td>
                           </tr>
                        );
                     })}
                  </>
               ) : (
                  <tr>
                     <td colSpan={2}>
                        <p className="text-center">¯\_(ツ)_/¯</p>
                     </td>
                  </tr>
               )}
            </>
         )}
      </Table>
   );

   const classes = {
      tab: "px-[12px] sm:px-[24px] py-1 ml-[8px] mt-[8px]",
      menuItem:
         "px-3 py-1 flex font-[500] items-center hover:text-[#cd1818] space-x-1 hover:bg-[#e1e1e1]",
   };

   if (status === "error") return <p className="text-center">Some thing went wrong</p>;

   return (
      <>
         <div className="text-lg sm:text-2xl mb-[30px]">Product</div>

         <div className="flex justify-between">
            <DashboardSearch setTab={setTab} />
            <AddProductBtn />
         </div>

         <div className="flex flex-wrap mt-3 ml-[-8px] mb-[10px]">
            <Button
               colors={"second"}
               onClick={() => setTab("")}
               active={!tab}
               size={"clear"}
               className={classes.tab}
            >
               All
            </Button>
            {categories.map((cat, index) => {
               if (cat.hidden) return;
               const active = tab === cat.name_ascii;
               return (
                  <Button
                     colors={"second"}
                     key={index}
                     size={"clear"}
                     className={classes.tab}
                     onClick={() => setTab(cat.name_ascii)}
                     active={active}
                  >
                     {cat.name}
                     {status === "successful" && active && " (" + count + ")"}
                  </Button>
               );
            })}
         </div>

         <div className="mt-4">
            {renderProducts}
            {status === "loading" && (
               <p className="mt-[30px] text-center w-full">
                  <ArrowPathIcon className="w-[24px] animate-spin inline-block" />
               </p>
            )}
            {status !== "loading" && !!products.length && (
               <p className="text-center mt-[30px]">
                  <Button
                     colors={"second"}
                     disabled={remaining <= 0 || status === "more-loading"}
                     loading={status === "more-loading"}
                     onClick={() => handleGetMore()}
                  >
                     More
                  </Button>
               </p>
            )}
         </div>
      </>
   );
}
