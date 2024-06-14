// import { usePrivateRequest } from "@/hooks";
// import { selectedAllProduct } from "@/store";
// import { useToast } from "@/store/ToastContext";
// import { selectProduct, updateProduct } from "@/store/productSlice";
// import { setProducts, storingProducts } from "@/store/productsSlice";
// import { sleep } from "@/utils/appHelper";
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const URL = "/products";

// export default function useProductAction() {
//    const dispatch = useDispatch();
//    const [isFetching, setIsFetching] = useState(false);
//    const { productState } = useSelector(selectedAllProduct);

//    const { setErrorToast, setSuccessToast } = useToast();
//    const privateRequest = usePrivateRequest();

//    const navigate = useNavigate();

//    type Props = {
//       imageUrl: string;
//       productAscii: string;
//    };

//    const update = async ({ imageUrl, productAscii }: Props) => {
//       try {
//          setIsFetching(true);
//          if (import.meta.env.DEV) await sleep(500);

//          await privateRequest.put(`${URL}/${productAscii}`, {
//             image_url: imageUrl,
//          } as Partial<Product>);

//          dispatch(updateProduct({ image_url: imageUrl }));

//          setSuccessToast("Update image successful");
//       } catch (error) {
//          console.log({ message: error });
//          setErrorToast();
//       } finally {
//          setIsFetching(false);
//       }
//    };

//    const deleteProduct = async (productAscii: string) => {
//       try {
//          setIsFetching(true);
//          if (import.meta.env.DEV) await sleep(500);

//          await privateRequest.delete(`${URL}/${productAscii}`);

//          const newProducts = productState.products.filter(
//             (p) => p.product_ascii !== productAscii
//          );

//          // dispatch(setProducts({ products: newProducts }));

//          navigate("/dashboard/product");
//       } catch (error) {
//       } finally {
//          setIsFetching(false);
//       }
//    };

//    return { isFetching, update, deleteProduct };
// }
