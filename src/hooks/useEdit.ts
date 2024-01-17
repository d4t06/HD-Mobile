import { CategoryAttribute, Product, ProductColor, ProductStorage } from "@/types";
import { useEffect, useRef, useState } from "react";
import { usePrivateRequest } from ".";
import { sleep } from "@/utils/appHelper";
import { useParams } from "react-router-dom";

const PRODUCT_URL = "/product-management/products";
const CAT_ATTR_URL = "/app/category-attributes";

export default function useEdit() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [productData, setProductData] = useState<Product>();

  const [storages, setStorages] = useState<ProductStorage[]>([]);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [attrList, setAttrList] = useState<CategoryAttribute[]>([]);

  const ranUseEffect = useRef(false);

  //   hooks
  const privateRequest = usePrivateRequest();
  const { id } = useParams();

  const initStockProductData = (
    type: "color" | "storage",
    storagesData: ProductStorage[],
    colorsData: ProductColor[]
  ) => {
    switch (type) {
      case "storage":
        setStorages(storagesData);
        break;
      case "color":
        setColors(colorsData);
    }
  };

  const getProductDetail = async ({ init = true }: { init?: boolean }) => {
    if (!id) throw new Error("missing params");
    if (import.meta.env.DEV) await sleep(300);

    const res = await privateRequest.get(`${PRODUCT_URL}/${id}`);
    const data = res.data as Product;

    if (init) {
      const categoryId = data.category_id;
      if (categoryId === undefined) throw new Error("missing category id");

      const catAttrsRes = await privateRequest.get(`${CAT_ATTR_URL}/${categoryId}`);
      const catAttrsData = catAttrsRes.data.data as CategoryAttribute[];

      setAttrList(catAttrsData);
    }
    
    setProductData(data);

    const storagesData = data.storages_data as ProductStorage[];
    const colorsData = data.colors_data as ProductColor[];
    if (storagesData.length) initStockProductData("storage", storagesData, []);
    if (colorsData.length) initStockProductData("color", [], colorsData);
  };

  useEffect(() => {
    const handleGetProductDetail = async () => {
      try {
        await getProductDetail({ init: true });

        setStatus("success");
      } catch (error) {
        console.log(error);

        setStatus("error");
      }
    };

    if (!ranUseEffect.current) {
      handleGetProductDetail();
      ranUseEffect.current = true;
    }
  }, []);

  return {
    productData,
    status,
    colors,
    setColors,
    attrList,
    storages,
    setStorages,
    getProductDetail,
  };
}
