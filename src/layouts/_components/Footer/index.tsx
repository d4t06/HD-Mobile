import PushFrame from "@/components/ui/PushFrame";
import "./style.scss";
import { MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";

function Footer() {
   return (
      <div className="footer">
         <div className="container mx-auto">
            <PushFrame>
               <div className="flex flex-wrap text-[#333] p-[20px]">
                  <div className="w-full sm:w-1/2 flex flex-col items-center justify-center">
                     <h1 className="text-[22px] leading-[26px] text-[#000] font-semibold">
                        HD <span className="text-[#cd1818]">Mobile</span>
                     </h1>
                  </div>
                  <div className="flex mt-[30px] md:mt-0 w-full sm:w-1/2">
                     <div className="w-1/2 md:w-1/3">
                        <h5 className="text-[16px] font-semibold">Liên hệ</h5>

                        <ul className="list">
                           <li>
                              <PhoneIcon className="w-[24px]" />
                              <span>0123456890</span>
                           </li>
                           <li>
                              <PhoneIcon className="w-[24px]" />
                              <span>0123456890</span>
                           </li>
                        </ul>
                     </div>

                     <div className="w-1/2 md:w-1/3">
                        <h5 className="text-[16px] font-semibold">Địa chỉ</h5>

                        <ul className="list">
                           <li>
                              <MapPinIcon className="w-[24px]" />
                              <span>Tri Tôn, An Giang</span>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            </PushFrame>
         </div>
      </div>
   );
}
export default Footer;
