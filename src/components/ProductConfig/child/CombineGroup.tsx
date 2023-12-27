import { Ref, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { moneyFormat } from "@/utils/appHelper";
import { ProductCombine } from "@/types";
import { usePrivateRequest } from "@/hooks";
import Input from "@/components/ui/Input";

type InputGroupProps = {
   initCombine: ProductCombine;
   isExist: boolean;
};

export type CombineRef = {
   submit: () => Promise<ProductCombine | undefined>;
   validate: () => boolean;
};

const COMBINE_URL = "/combine-management";

function InputGroup({ initCombine, isExist }: InputGroupProps, ref: Ref<CombineRef>) {
   const [combineData, setCombineData] = useState<ProductCombine>(initCombine);
   const stockCombine = useRef(initCombine);
   const [error, setError] = useState(false);

   const privateRequest = usePrivateRequest();

   const handleInput = (field: keyof typeof combineData, value: string) => {
      setError(false);
      if (field === "price") {
         value = value.replaceAll(",", "");
      }
      if (!Number.isInteger(+value)) return;
      setCombineData({ ...combineData, [field]: +value });
   };

   const detectChange = () => {
      if (stockCombine.current.price !== combineData.price || stockCombine.current.quantity !== combineData.quantity)
         return true;
      else return false;
   };

   const trackingCombine = (): "new" | "update" | "unChange" => {
      if (!isExist) return "new";
      if (detectChange()) return "update";
      return "unChange";
   };

   const validate = () => {
      console.log("validate check price", combineData.price);

      if (!combineData.price) {
         setError(true);
         return true;
         // throw new Error("Price is missing");
      } else return false;
   };

   const submit = async () => {
      try {
         // let newCombines : ProductCombine[] = []
         // let updateCombines : ProductCombine[] | undefined = []
         const status = trackingCombine();
         switch (status) {
            case "new":
               // await privateRequest.post(COMBINE_URL, combineData, {
               //    headers: { "Content-Type": "application/json" },
               // });
               return combineData;
            case "update":
               console.log("update");
               await privateRequest.post(COMBINE_URL + "/update", combineData, {
                  headers: { "Content-Type": "application/json" },
               });
               return;
            case "unChange":
               console.log("unChange combine");
               return;
         }
      } catch (error) {
         console.log({ message: error });
         throw new Error("error");
      }
   };

   useImperativeHandle(ref, () => ({
      submit,
      validate,
   }));

   return (
      <div className="col col-6">
         <div className="row">
            <div className="col col-6">
               <Input
                  placeholder="Quantity"
                  value={combineData.quantity}
                  cb={(value) => handleInput("quantity", value)}
               />
            </div>

            <div className="col col-6">
               <Input
                  className={error ? "bg-red-200" : ""}
                  placeholder="Price"
                  value={moneyFormat(combineData.price || "")}
                  cb={(value) => handleInput("price", value)}
               />
            </div>
         </div>
      </div>
   );
}

export default forwardRef(InputGroup);
