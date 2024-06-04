import ProductDataProvider from "@/store/ProductDataContext";
import EditProductMain from "./main";

export default function EditProduct() {
   return (
      <ProductDataProvider>
         <EditProductMain />
      </ProductDataProvider>
   );
}
