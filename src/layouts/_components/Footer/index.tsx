import PushFrame from "@/components/ui/PushFrame";
import "./style.scss";
import { DevicePhoneMobileIcon, MapPinIcon } from "@heroicons/react/24/outline";

function Footer() {
   return (
      <div className="footer">
         <div className="container mx-auto">
            <PushFrame>
               <div className="flex flex-wrap p-[20px]">
                  <div className="w-full sm:w-1/2 flex flex-col items-center justify-center">
                     <h1 className="text-2xl font-medium">
                        HD <span className="text-[#cd1818]">Mobile</span>
                     </h1>
                  </div>
                  <div className="flex mt-[30px] md:mt-0 w-full sm:w-1/2">
                     <div className="w-1/2 md:w-1/3">
                        <h5 className="flex font-medium space-x-1">
                           <DevicePhoneMobileIcon className="w-5" />
                           <span>Hotline</span>
                        </h5>

                        <div className="mt-2 text-sm font-medium text-[#3f3f3f]">
                           <p>0123456890</p>
                           <p>0123456890</p>
                        </div>
                     </div>

                     <div className="w-1/2 md:w-1/3">
                        <h5 className="flex font-medium space-x-1">
                           <MapPinIcon className="w-5" />
                           <span>Address</span>
                        </h5>

                        <div className="mt-2 text-sm font-medium text-[#3f3f3f]">
                           <p>Tri Tôn, An Giang</p>
                        </div>
                     </div>
                  </div>
               </div>
            </PushFrame>
         </div>
      </div>
   );
}
export default Footer;
