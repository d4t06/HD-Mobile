import { DocumentTextIcon, Cog6ToothIcon } from "@heroicons/react/16/solid";
import Title from "@/components/Title";
import DescSection from "./child/DescSection";
import SpecSection from "./child/SpecSection";

type Props = {
   loading: boolean;
   product: ProductDetail | null;
};

export default function DetailBody({ loading, product }: Props) {
   return (
      <div className="mt-[30px] space-y-[30px] md:space-y-0 md:flex flex-wrap-reverse md:mx-[-12px]">
         <div className={"mt-[40px] md:mt-0 md:w-2/3 flex-shrink-0 md:px-[12px]"}>
            <Title className="mb-[20px]">
               <DocumentTextIcon className="w-[24px]" />
               <span>Chi tiết</span>
            </Title>
            <DescSection loading={loading} product={product} />
         </div>
         <div className="md:mt-0 md:w-1/3 flex-shrink-0 md:px-[12px]">
            <div className="sm:sticky top-[10px]">
               <Title className="mb-[20px]">
                  <Cog6ToothIcon className="w-[24px]" />
                  <span>Thông số</span>
               </Title>
               <SpecSection loading={loading} product={product} />
            </div>
         </div>
      </div>
   );
}
