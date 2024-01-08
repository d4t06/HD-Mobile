import { ChangeEventHandler } from "react";
import useLocalStorage from "./useLocalStorage";

const useToggle = (key: string, initValue: boolean) => {
   const [value, setValue] = useLocalStorage(key, initValue);

   const toggle: ChangeEventHandler<HTMLInputElement> = () => {
      setValue((prev) => {
         return typeof value === "boolean" ? !prev : value;
      });
   };
   return {value, toggle};
};

export default useToggle;
