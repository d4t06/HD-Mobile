import { ModalRef } from "@/components/Modal";
import { useToast } from "@/store/ToastContext";
import { setCategory } from "@/store/categorySlice";
import { privateRequest } from "@/utils/request";
import { RefObject, useState } from "react";
import { useDispatch } from "react-redux";

const IMPORT_URL = "/categories/import";

type Props = {
   modalRef: RefObject<ModalRef>;
};

export function useImportCategory({ modalRef }: Props) {
   const dispatch = useDispatch();

   const [status, setStatus] = useState<"input" | "fetching" | "error" | "finish">(
      "input",
   );

   const { setErrorToast, setSuccessToast } = useToast();

   const submit = async (value: string) => {
      try {
         setStatus("fetching");

         const json = JSON.parse(value);

         const res = await privateRequest.post(IMPORT_URL, {
            data: json,
         });

         const categories = res.data.data as Category[];

         dispatch(setCategory({ type: "add", categories }));

         setStatus("finish");
         setSuccessToast("Import category successful");
      } catch (error) {
         console.log({ message: error });

         modalRef.current?.close();
         setErrorToast();
      }
   };

   return {
      status,
      setStatus,
      submit,
   };
}
