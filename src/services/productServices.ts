import { Param } from "@/store/productsSlice";
import { privateRequest, publicRequest } from "@/utils/request";

export const getProducts = async (props: Param) => {
  if (!props) {
    console.log("product service missing query");
    return [];
  }

  const { filters, sort, category_id, page } = props;
  if (category_id === undefined) {
    console.log("missing category_id");

    throw new Error("missing category");
  }
  const params: Record<string, string | string[] | number[] | number> = {
    page: page || 1,
    category_id,
  };

  if (filters && filters.brands.length)
    params["brand_id"] = filters.brands.map((b) => b.id) as number[];
  if (sort && sort.column && sort.type) {
    params["column"] = sort.column;
    params["type"] = sort.type;
  }

  if (filters?.price) {
    params["price"] = [filters.price.from, filters.price.to];
  }

  const response = await publicRequest.get(`/products`, {
    params,
  });
  return response.data;
};

type AdminParams = Record<string, string | string[] | number[] | number>;
export const getProductsAdmin = async (props: Param) => {
  const { filters, category_id, page } = props;

  const params: AdminParams = { page: page || 1 };
  if (filters && filters.brands.length)
    params["brand_id"] = filters.brands.map((b) => b.id) as number[];
  if (category_id) params["category_id"] = category_id;
  // if (sort && sort.column && sort.type) {
  //    params["column"] = sort.column;
  //    params["type"] = sort.type;
  // }

  // try {
  const response = await privateRequest.get(`/product-management/products`, {
    params,
  });
  return response.data;
  // } catch (error) {
  //    console.log("loi getProducts services", error);
  //    throw new Error("loi getProducts services");
  // }
};

export const getProductDetail = async (params: { id: string }) => {
  if (!params) {
    console.log("product service missing query");
    return;
  }
  const { id } = params;
  try {
    const response = await publicRequest.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.log("loi getProductDetail services", error);
  }
};

export const buyProduct = async (data: any) => {
  if (!data) {
    console.log("data missing !");
    return;
  }
  try {
    publicRequest.post("/products", {
      body: {
        ...data,
      },
    });
  } catch (error) {
    console.log("buy product fail, ", error);
  }
};
