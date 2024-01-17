import { useEffect, useMemo, useRef, useState } from "react";
import { redirect, useParams } from "react-router-dom";

// import classNames from "classnames/bind";

import { generateId, initColorObject, initStorageObject, sleep } from "@/utils/appHelper";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import ProductConfig, { ConfigRef } from "./child";
import {
  CategoryAttribute,
  Product,
  ProductColor,
  ProductCombine,
  ProductCombineSchema,
  ProductDetail,
  ProductStorage,
} from "@/types";
import Empty from "@/components/ui/Empty";
import { Button, Modal } from "@/components";
import ProductDataProvider from "@/store/ProductDataContext";
import {
  findMinCombineOfStorage,
  initCombinesForInsert,
  initProductSlidersForInsert,
} from "@/utils/productHelper";
import { useToast } from "@/store/ToastContext";
import AddItem from "@/components/Modal/AddItem";
import OverlayCTA from "@/components/ui/OverlayCTA";
import useVariantAction from "@/hooks/useVariantAction";
import ConfirmModal from "@/components/Modal/Confirm";
import useProductAction from "@/hooks/useProductAction";
import MyEditor, { EditorRef } from "@/components/MyEditor";
import useEdit from "@/hooks/useEdit";

type ModelTarget =
  | "add-storage"
  | "edit-storage"
  | "add-color"
  | "edit-color"
  | "delete-storage"
  | "delete-color"
  | "delete-product";

const MAX_VAL = 999999999;
const STORAGE_URL = "/storage-management/storages";
const PRODUCT_DETAIL_URL = "/product-detail-management";
const PRODUCT_SLIDER_URL = "/slider-management/product-sliders";
const COMBINE_URL = "/combine-management/combines";
const PRODUCT_URL = "/product-management/products";
const CAT_ATTR_URL = "/app/category-attributes";
const PRODUCT_ATTRIBUTE_URL = "/product-attribute-management";

function EditProduct() {
  // const [productData, setProductData] = useState<Product>();
  // const [attrList, setAttrList] = useState<CategoryAttribute[]>([]);

  // const [storages, setStorages] = useState<ProductStorage[]>([]);
  // const [colors, setColors] = useState<ProductColor[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  // const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [apiProductLoading, setProductApiLoading] = useState(false);
  const [isChange, setIsChange] = useState(false);

  const addItemModalTarget = useRef<ModelTarget | "">("");
  // const ranUseEffect = useRef(false);
  const ProductConfigRef = useRef<ConfigRef>(null);
  const curColorIndex = useRef<number | undefined>();
  const curStorageIndex = useRef<number | undefined>();
  const editorRef = useRef<EditorRef>();
  const isEditorChange = useRef(false);

  // use hook
  // const { id } = useParams();
  const { setSuccessToast, setErrorToast } = useToast();
  const privateRequest = usePrivateRequest();
  const { deleteProduct } = useProductAction({ setIsOpenModal });
  const {
    attrList,
    colors,
    productData,
    setColors,
    setStorages,
    status,
    storages,
    getProductDetail,
  } = useEdit();
  const { addColor, addStorage, apiLoading, deleteColor, deleteStorage } =
    useVariantAction({
      colors,
      setColors,
      setStorages,
      setIsOpenModal,
      storages,
    });

  const handleOpenModal = (
    type: typeof addItemModalTarget.current,
    curIndex?: number
  ) => {
    addItemModalTarget.current = type;
    switch (type) {
      case "add-color":
      case "edit-color":
      case "delete-color":
        curColorIndex.current = curIndex;
        break;

      case "add-storage":
      case "edit-storage":
      case "delete-storage":
        curStorageIndex.current = curIndex;
        break;
    }
    setIsOpenModal(true);
  };

  const handleAddColor = async (type: "Add" | "Edit", value: string, id?: number) => {
    const newColor = initColorObject({
      color: value,
      color_ascii: generateId(value),
      product_name_ascii: productData?.product_name_ascii,
    });

    await addColor(newColor, type, curColorIndex.current, id);
  };

  const handleAddStorage = async (type: "Add" | "Edit", value: string, id?: number) => {
    const newStorage = initStorageObject({
      storage: value,
      storage_ascii: generateId(value),
      product_name_ascii: productData?.product_name_ascii,
    });

    await addStorage(newStorage, type, curStorageIndex.current, id);
  };

  const handleDeleteColor = async () => {
    await deleteColor(curColorIndex.current);
  };

  const handleDeleteStorage = async () => {
    await deleteStorage(curStorageIndex.current);
    redirect("/dashboard/products");
  };

  const submitSlider = async () => {
    // >>> tracking and submit slider and slider images
    const newSlidersSchema = await ProductConfigRef.current!.submitSliders();

    if (colors.length) {
      // >>> api add new products sliders
      if (newSlidersSchema.length) {
        const data = initProductSlidersForInsert(
          newSlidersSchema,
          colors,
          productData?.product_name_ascii as string
        );
        if (!data.length) {
          throw new Error("product slider error");
        }
        console.log(">>> api submit product slider");
        await privateRequest.post(PRODUCT_SLIDER_URL, data, {
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  };

  const submitAttributes = async () => {
    if (ProductConfigRef.current === null)
      throw new Error("ProductConfigRef.current is undefined");
    const newProductAttrs = await ProductConfigRef.current.submitAttributes();

    if (newProductAttrs.length) {
      console.log(">>> api submit attributes");
      await privateRequest.post(PRODUCT_ATTRIBUTE_URL, newProductAttrs);
    }
  };

  const submitDetail = async () => {
    const content = editorRef.current?.getContent();
    if (!content || !productData?.product_name_ascii)
      return console.log("content or product name is undefined");

    const data: ProductDetail = {
      content,
      product_name_ascii: productData?.product_name_ascii,
    };

    if (!isEditorChange.current) return;

    if (!productData.detail) {
      console.log(">>> api add new content");
      return await privateRequest.post(PRODUCT_DETAIL_URL, data);
    } else if (productData.detail.id) {
      console.log(">>> api update content");
      return await privateRequest.put(
        `${PRODUCT_DETAIL_URL}/${productData.detail.id}`,
        data
      );
    }
  };

  const submitCombines = async (
    newCombines: ProductCombine[],
    updateCombines: ProductCombine[]
  ) => {
    let newCombinesRes: ProductCombine[] = [];

    if (newCombines.length) {
      const storageIdObject: Record<string, number> = {};
      storages.forEach((item) => {
        storageIdObject[item.storage_ascii] = item.id as number;
      });

      const colorIdObject: Record<string, number> = {};
      [...colors].forEach(
        (item) => (colorIdObject[item.color_ascii] = item.id as number)
      );

      const combinesSchema = initCombinesForInsert(
        newCombines,
        colorIdObject,
        storageIdObject
      );

      console.log(">>> api add new combine");

      const res = await privateRequest.post(COMBINE_URL, combinesSchema, {
        headers: { "Content-Type": "application/json" },
      });
      const data = res.data as ProductCombine[];

      newCombinesRes = data;
    }

    if (updateCombines.length) {
      const combinesSchema = updateCombines.map((cb) => {
        let combineSchema: ProductCombineSchema & { id: number };
        const { color_data, storage_data, ...schema } = cb;
        combineSchema = schema as ProductCombineSchema & { id: number };
        return combineSchema;
      });

      // >>> api update combine
      console.log(">>> api update combine");

      for await (const item of combinesSchema) {
        await privateRequest.put(`${COMBINE_URL}/${item.id}`, item, {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return newCombinesRes;
  };

  const handleEditorChange = () => {
    isEditorChange.current = true;
    setIsChange(true);
  };

  const updateStorageBasePrice = async (mergedCombines: ProductCombine[]) => {
    let minCB: ProductCombine | undefined;
    let prevDefaultCb: ProductCombine | undefined;
    let minPriceOfProduct = MAX_VAL;

    for await (const storageItem of storages) {
      // loop not removed storage items
      if (storageItem.id === undefined) {
        console.log("no found storage id");
        break;
      }

      const { cb, minPrice, defaultCB } = findMinCombineOfStorage(
        storageItem,
        mergedCombines
      );

      if (defaultCB) prevDefaultCb = defaultCB;
      if (minPriceOfProduct > minPrice) {
        minPriceOfProduct = minPrice;
        minCB = cb;
      }

      // when init, record.base_price = 0
      if (!storageItem.base_price || storageItem.base_price !== minPrice) {
        // assign base price
        storageItem.base_price = minPrice;
        // >>> api update storage
        await privateRequest.put(`${STORAGE_URL}/${storageItem.id}`, storageItem, {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return { minCB, prevDefaultCb };
  };

  const updateDefaultCombine = async (
    minCB: ProductCombine,
    prevDefaultCb: ProductCombine | undefined
  ) => {
    const updateNewDefaultCB = async () => {
      privateRequest.put(
        `${COMBINE_URL}/${minCB!.id}`,
        { default: true },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    };

    if (!productData?.combines_data.length) {
      await updateNewDefaultCB();
    } else {
      if (!prevDefaultCb || !prevDefaultCb?.id) throw new Error("Update default error");

      if (prevDefaultCb.id !== minCB.id) {
        await privateRequest.put(
          `${COMBINE_URL}/${prevDefaultCb.id}`,
          { default: false },
          { headers: { "Content-Type": "application/json" } }
        );

        await updateNewDefaultCB();
      }
    }
  };

  const submitUpdateCombine = async (combines: ProductCombine[]) => {
    const combinesObject: Record<number, ProductCombine> = {};
    combines.map((cb) => {
      if (!cb.id) return;
      combinesObject[cb.id] = cb;
    });
    const filteredCombines = Object.entries(combinesObject).map(([_key, cb]) => cb);
    // >>> submit update storage base_price
    const { minCB, prevDefaultCb } = await updateStorageBasePrice(filteredCombines);

    if (!minCB) throw new Error("Min cb error");
    // >>> submit update default combine
    await updateDefaultCombine(minCB, prevDefaultCb);
  };

  const handleSubmit = async () => {
    try {
      if (!isChange) throw new Error("unChange");
      if (!productData || !productData.product_name_ascii) return;

      ProductConfigRef.current?.validate();

      setProductApiLoading(true);

      // >>> submit slider
      await submitSlider();
      const { newCombines, updateCombines } = ProductConfigRef.current!.trackingCombine();

      // >>> submit new combine
      const newCombinesRes = await submitCombines(newCombines, updateCombines);

      const isUpdateOrAddNewCombine = !!newCombines.length || !!updateCombines.length;
      if (isUpdateOrAddNewCombine) {
        const mergedCombines = [
          ...productData.combines_data,
          ...newCombinesRes,
          ...updateCombines,
        ];
        // >>> submit update combine
        await submitUpdateCombine(mergedCombines);
      }

      // >>> submit attribute
      await submitAttributes();

      // >>> submit detail
      await submitDetail();

      await getProductDetail({ init: false });

      setSuccessToast("Edit product successful");
      setIsChange(false);
    } catch (error) {
      console.log({ message: error });
      setErrorToast("Error when edit product");
    } finally {
      setProductApiLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    await deleteProduct(productData);
  };

  const renderModal = useMemo(() => {
    if (!isOpenModal) return;

    switch (addItemModalTarget.current) {
      case "add-color":
        return (
          <AddItem
            loading={apiLoading}
            title={"Add color"}
            cbWhenSubmit={(value) => handleAddColor("Add", value)}
            setIsOpenModal={setIsOpenModal}
          />
        );
      case "edit-color":
        if (curColorIndex.current !== undefined) {
          const currentColor = colors[curColorIndex.current];
          return (
            <AddItem
              loading={apiLoading}
              title={"Edit color"}
              cbWhenSubmit={(value) => handleAddColor("Edit", value, currentColor.id)}
              setIsOpenModal={setIsOpenModal}
              initValue={currentColor.color}
            />
          );
        }
        return <h1 className="text-2xl">Cur index not found</h1>;
      case "add-storage":
        return (
          <AddItem
            loading={apiLoading}
            title={"Add storage"}
            cbWhenSubmit={(value) => handleAddStorage("Add", value)}
            setIsOpenModal={setIsOpenModal}
          />
        );
      case "edit-storage":
        if (curStorageIndex.current !== undefined) {
          const curStorage = storages[curStorageIndex.current];
          return (
            <AddItem
              loading={apiLoading}
              title={"Edit storage"}
              cbWhenSubmit={(value) => handleAddStorage("Edit", value, curStorage.id)}
              setIsOpenModal={setIsOpenModal}
              initValue={curStorage.storage}
            />
          );
        }
        break;
      case "delete-color":
        if (curColorIndex.current === undefined)
          return <h1 className="text-2xl">Cur index not found</h1>;
        return (
          <ConfirmModal
            label={`Delete color '${colors[curColorIndex.current].color} ?'`}
            loading={apiLoading}
            callback={handleDeleteColor}
            setOpenModal={setIsOpenModal}
          />
        );
      case "delete-storage":
        if (curStorageIndex.current === undefined)
          return <h1 className="text-2xl">Cur index not found</h1>;
        return (
          <ConfirmModal
            label={`Delete storage '${storages[curStorageIndex.current].storage} ?'`}
            loading={apiLoading}
            callback={handleDeleteStorage}
            setOpenModal={setIsOpenModal}
          />
        );
      case "delete-product":
        if (!productData) return <h1 className="text-2xl">Product not found</h1>;
        return (
          <ConfirmModal
            label={`Delete '${productData.product_name}'`}
            loading={apiLoading}
            setOpenModal={setIsOpenModal}
            callback={handleDeleteProduct}
          />
        );
    }
  }, [isOpenModal, apiLoading]);

  //  run get product detail
  // useEffect(() => {
  //   const getProductDetail = async () => {
  //     try {
  //       if (!id) throw new Error("missing params");
  //       if (import.meta.env.DEV) await sleep(300);

  //       const res = await privateRequest.get(`${PRODUCT_URL}/${id}`);
  //       const data = res.data as Product;

  //       const categoryId = data.category_id;
  //       if (categoryId === undefined) throw new Error("missing category id");

  //       const catAttrsRes = await privateRequest.get(`${CAT_ATTR_URL}/${categoryId}`);

  //       const catAttrsData = catAttrsRes.data.data as CategoryAttribute[];
  //       setAttrList(catAttrsData);

  //       setProductData(data);
  //       const storagesData = data.storages_data as ProductStorage[];
  //       const colorsData = data.colors_data as ProductColor[];
  //       if (storagesData.length) {
  //         initStockProductData("storage", storagesData, []);
  //       }

  //       if (colorsData.length) {
  //         initStockProductData("color", [], colorsData);
  //       }

  //       if (import.meta.env.DEV) {
  //         await sleep(300);
  //       }

  //       setStatus("success");
  //     } catch (error) {
  //       console.log(error);

  //       setStatus("error");
  //     }
  //   };

  //   if (!ranUseEffect.current) {
  //     getProductDetail();
  //     ranUseEffect.current = true;
  //   }
  // }, []);

  const classes = {
    label: "text-[20px] font-semibold text-[#333] mb-[8px]",
    container: "flex bg-[#fff] rounded-[12px] p-[20px]",
  };

  // console.log("chekc status", status);

  if (status === "loading") return <i className="material-icons animate-spin">sync</i>;
  if ((!productData && status === "success") || status === "error")
    return <h1>Some thing went wrong</h1>;

  return (
    <>
      <div className="flex items-center text-[#cd1818] mb-[20px]">
        <i className="material-icons mr-[8px]">mode_edit</i>
        <h1 className={`text-[22px] font-semibold text-[#cd1818]`}>
          {productData?.product_name}
        </h1>
      </div>

      <div className="pb-[30px]">
        <div className="row mb-[30px]">
          <div className="col w-1/2 ">
            <h5 className={classes.label}>Storage</h5>
            <div className={classes.container}>
              {!!storages.length &&
                storages.map((item, index) => {
                  return (
                    <div key={index} className="col w-1/4">
                      <Empty fontClassName="bg-[#f1f1f1]" className="group">
                        <span className="text-center font-semibold text-[16px]">
                          {item.storage}
                        </span>
                        <OverlayCTA
                          data={[
                            {
                              cb: () => handleOpenModal("edit-storage", index),
                              icon: "edit",
                            },
                            {
                              cb: () => handleOpenModal("delete-storage", index),
                              icon: "delete",
                            },
                          ]}
                        />
                      </Empty>
                    </div>
                  );
                })}
              <div className="col w-1/4">
                <Empty
                  fontClassName="bg-[#f1f1f1]"
                  onClick={() => handleOpenModal("add-storage")}
                />
              </div>
            </div>
          </div>
          <div className="col w-1/2">
            <h5 className={classes.label}>Color</h5>
            <div className={classes.container}>
              {!!colors.length &&
                colors.map((item, index) => (
                  <div key={index} className="col w-1/4">
                    <Empty fontClassName="bg-[#f1f1f1]">
                      <span className="font-semibold text-[16px]">{item.color}</span>
                      <OverlayCTA
                        data={[
                          {
                            cb: () => handleOpenModal("edit-color", index),
                            icon: "edit",
                          },
                          {
                            cb: () => handleOpenModal("delete-color", index),
                            icon: "delete",
                          },
                        ]}
                      />
                    </Empty>
                  </div>
                ))}
              <div className="col w-1/4">
                <Empty
                  fontClassName="bg-[#f1f1f1]"
                  onClick={() => handleOpenModal("add-color")}
                />
              </div>
            </div>
          </div>
        </div>

        {productData && attrList && (
          <ProductDataProvider setIsChange={setIsChange} initialState={productData}>
            <ProductConfig
              attrList={attrList}
              ref={ProductConfigRef}
              colors={colors}
              storages={storages}
            />
          </ProductDataProvider>
        )}

        <h5 className={classes.label}>Description</h5>
        <div className="rounded-[12px] overflow-hidden">
          <MyEditor
            content={productData?.detail ? productData.detail.content : ""}
            ref={(ref) => (editorRef.current = ref!)}
            onUpdate={handleEditorChange}
          />
        </div>

        <p className="text-center mt-[30px]">
          <Button
            disable={!isChange}
            isLoading={apiProductLoading}
            onClick={handleSubmit}
            primary
          >
            <i className="material-icons mr-[8px]">save</i> Save
          </Button>
        </p>

        <h5 className={` text-red-500 mt-[30px] ${classes.label} font-semibold`}>
          DANGER ZONE
        </h5>
        <div className="border-red-500 border rounded-[16px] p-[14px]">
          <Button onClick={() => handleOpenModal("delete-product")} primary>
            Delete Product
          </Button>
        </div>
      </div>

      {isOpenModal && <Modal setShowModal={setIsOpenModal}>{renderModal}</Modal>}
    </>
  );
}

export default EditProduct;
