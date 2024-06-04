import { XMarkIcon } from "@heroicons/react/16/solid";
import { Button } from "..";

export default function ModalHeader({
   close,
   title,
}: {
   title: string;
   close: () => void;
}) {
   return (
      <div className="flex justify-between mb-[30px]">
         <h1 className="text-[22px] text-[#333] font-semibold">{title}</h1>
         <Button size={"clear"} className="p-[4px]" colors={"second"} onClick={close}>
            <XMarkIcon className="w-[24px]" />
         </Button>
      </div>
   );
}
