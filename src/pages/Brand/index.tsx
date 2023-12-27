import classNames from "classnames/bind";
import styles from "./Brand.module.scss";
import inputStyles from "@/components/ui/Input/Input.module.scss";
import { useEffect, useRef, useState } from "react";
import { Brand, Category } from "@/types";
import { usePrivateRequest } from "@/hooks";
import Empty from "@/components/ui/Empty";
import { Button, Gallery, Modal, QuickFilter } from "@/components";
import MyInput from "@/components/ui/Input";
import { generateId } from "@/utils/appHelper";
const cx = classNames.bind(styles);
const inputCx = classNames.bind(inputStyles);

const CAT_URL = "/app/category";
const BRAND_URL = "/app/brand";

export default function CategoryBrand() {
   const [curCategory, setCurCategory] = useState("");
   const [categories, setCategories] = useState<Category[]>([]);
   const [catData, setCatData] = useState<Category>({ category_name: "", category_name_ascii: "", icon: "" });
   const [brandData, setBrandData] = useState<Brand>({ brand_name: "", brand_name_ascii: "", image_url: "" });
   const [brands, setBrands] = useState<Brand[]>([]);

   const [isOpenModal, setIsOpenModal] = useState(false);

   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

   const [catLoading, setCatLoading] = useState(false);
   const [brandLoading, setBrandLoading] = useState(false);

   const ranUseEffect = useRef(false);
   const categoryRef = useRef<HTMLInputElement>(null);
   const brandRef = useRef<HTMLInputElement>(null);

   const privateRequest = usePrivateRequest();

   const handleBrandInput = (field: keyof typeof brandData, value: string) => {
      setBrandData({ ...brandData, [field]: value });
   };

   const handleCatInput = (field: keyof typeof catData, value: string) => {
      setCatData({ ...catData, [field]: value });
   };
   const handleAddCategory = async () => {
      try {
         setCatLoading(true);
         if (!catData.category_name.trim()) return;
         const newCategory: Category = { ...catData, category_name_ascii: generateId(catData.category_name) };

         await privateRequest.post(CAT_URL, newCategory);

         setCategories((prev) => [...prev, newCategory]);
      } catch (error) {
         console.log({ message: error });
      } finally {
         setCatLoading(false);
      }
   };

   const deleteCategory = async (category_name_ascii: string) => {
      try {
         setCatLoading(true);

         await privateRequest.get(CAT_URL + "/delete/" + category_name_ascii);
         const newCategories = categories.filter((c) => c.category_name_ascii !== category_name_ascii);
         setCategories(newCategories);
      } catch (error) {
         console.log({ message: error });
      } finally {
         setCatLoading(false);
      }
   };

   const handleChoseBrandImage = (image_url: string) => {
      handleBrandInput("image_url", image_url);
   };

   const handleAddBrand = async () => {
      try {
         setBrandLoading(true);
         if (!brandData.brand_name.trim()) return;

         const fullBrandData: Brand & { category_name_ascii: string } = {
            ...brandData,
            brand_name_ascii: generateId(brandData.brand_name),
            category_name_ascii: curCategory,
         };

         await privateRequest.post(BRAND_URL, fullBrandData);

         setBrands((prev) => [...prev, fullBrandData]);
      } catch (error) {
         console.log({ message: error });
      } finally {
         setBrandLoading(false);
      }
   };

   useEffect(() => {
      const getConfig = async () => {
         try {
            const categoriesRes = await privateRequest.get(CAT_URL);
            const categories = categoriesRes.data as Category[];

            if (categories.length > 0) {
               setCategories(categoriesRes.data || []);
               setCurCategory(categories[0].category_name_ascii);
            }
            setStatus("success");
         } catch (error) {
            console.log({ message: error });
            setStatus("error");
         }
      };

      if (!ranUseEffect.current) {
         ranUseEffect.current = true;
         getConfig();
      }
   }, []);

   useEffect(() => {
      const getBrands = async () => {
         try {
            const brandsRes = await privateRequest.get(BRAND_URL + "?category=" + curCategory);
            const brandsData = brandsRes.data as Brand[];

            setBrands(brandsData);
         } catch (error) {
            console.log({ message: error });
         }
      };

      if (curCategory) {
         getBrands();
      }
   }, [curCategory]);

   if (status === "loading") return <h2>Loading...</h2>;

   if (status === "error") return <h1>Some thing went wrong</h1>;

   return (
      <>
         <div className="">
            <h1 className={cx("page-title")}>Category</h1>
            <br />

            <div className={`row ${catLoading && "disable"}`}>
               <div className="col col-3">
                  <p className={cx("input-label")}>Add new category</p>
                  <MyInput
                     placeholder="Category name"
                     ref={categoryRef}
                     className="mb-10"
                     cb={(value) => handleCatInput("category_name", value)}
                     value={catData.category_name}
                  />
                  <div className={cx("icon-input")}>
                     <MyInput
                        placeholder="Icon"
                        className="mb-10"
                        cb={(value) => handleCatInput("icon", value)}
                        value={catData.icon}
                     />
                     <div className="">{catData.icon && <i className="material-icons">{catData.icon}</i>}</div>
                  </div>

                  <br />
                  <br />
                  <br />

                  <Button disable={!catData.category_name} onClick={handleAddCategory} rounded fill>
                     <i className="material-icons">save</i> Add
                  </Button>
               </div>

               <div className="col col-9">
                  <div className={`row`}>
                     {status === "success" &&
                        categories &&
                        categories.map((item, index) => (
                           <div key={index} className="col col-3">
                              <Empty onClick={() => deleteCategory(item.category_name_ascii)}>
                                 <div className={cx("cat-item")}>
                                    {item.icon && <i className="material-icons">{item.icon}</i>}
                                    {item.category_name}
                                 </div>
                              </Empty>
                           </div>
                        ))}
                     <div className="col col-3">
                        <Empty onClick={() => categoryRef.current?.focus()} />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* <div className={cx("divide")}></div> */}

         <div className="">
            <h1 className={cx("page-title")}>Brand</h1>
            <br />

            {status === "success" && curCategory && (
               <>
                  <div className={`row ${brandLoading && "disable"}`}>
                     <div className="col col-3">
                        <div className={inputCx("form-group", "mb-15")}>
                           <p className={cx("input-label")}>Category</p>
                           <select name="category" value={curCategory} onChange={(e) => setCurCategory(e.target.value)}>
                              {!!categories.length &&
                                 categories.map((category, index) => (
                                    <option key={index} value={category.category_name_ascii}>
                                       {category.category_name}
                                    </option>
                                 ))}
                           </select>
                        </div>
                        <p className={cx("input-label")}>Add new brand</p>
                        <MyInput
                           ref={brandRef}
                           placeholder="Brand name"
                           className="mb-10"
                           cb={(value) => handleBrandInput("brand_name", value)}
                           value={brandData.brand_name}
                        />

                        {brandData.image_url && (
                           <div className={cx("brand-image")}>
                              <img src={brandData.image_url} />
                              <button>
                                 <i className="material-icons">delete</i>
                              </button>
                           </div>
                        )}

                        {!brandData.image_url && (
                           <Button onClick={() => setIsOpenModal(true)} rounded fill>
                              Choose image
                           </Button>
                        )}

                        <br />
                        <br />
                        <br />
                        <Button onClick={handleAddBrand} disable={!brandData.brand_name} className="mt-15" rounded fill>
                           <i className="material-icons">save</i>
                           Add
                        </Button>
                     </div>
                     <div className="col col-9">
                        <div className="row">
                           {status === "success" && !!brands.length && (
                              <QuickFilter loading={false} category="" admin brands={brands} />
                           )}
                        </div>
                     </div>
                  </div>
               </>
            )}
         </div>

         {isOpenModal && (
            <Modal setShowModal={setIsOpenModal}>
               <Gallery setIsOpenModal={setIsOpenModal} setImageUrl={handleChoseBrandImage} />
            </Modal>
         )}
      </>
   );
}
