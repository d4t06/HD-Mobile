import { useEffect } from "react";
import { useState } from "react";

const getLocalValue = <T>(key: string, initValue: T): T => {
   //SSR Next.js
   // if (typeof window === 'undefined') return initValue;

   //if value is already stored
   const localValue = JSON.parse(localStorage.getItem(key) || "{}");

   if (typeof localValue === "object") {
      if (Object.keys(localValue).length) return localValue;
   } else if (localValue) return localValue;

   return initValue;
};

const useLocalStorage = <T>(key: string, initValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
   const [value, setValue] = useState(() => {
      return getLocalValue(key, initValue);
   });

   useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
   }, [value, key]);

   return [value, setValue];
};

export default useLocalStorage;
