import { generateHsl } from "@/utils/generateHsl";
import { useMemo } from "react";

export default function AvatarPlaceholder({ name }: { name: string }) {
   const firstName = useMemo(() => {
      const arr = name.split(" ");
      return arr[arr.length - 1] || name;
   }, []);

   return (
      <div
         className="w-[44px] h-[44px] rounded-full flex items-center justify-center"
         style={{ backgroundColor: generateHsl(name) }}
      >
         <p className="text-xl text-white font-medium">
            {firstName.charAt(0).toUpperCase()}
         </p>
      </div>
   );
}
