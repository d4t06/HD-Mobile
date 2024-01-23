import PushFrame from "@/components/ui/PushFrame";
import "./style.scss";

function Footer() {
   return (
      <div className="footer">
         <div className="container">
            <PushFrame type="translate">
               <div className="flex flex-wrap text-[#333] p-[20px]">
                  <div className="w-full sm:w-1/2 flex flex-col items-center justify-center">
                     <h1 className="text-[22px] leading-[26px] text-[#000] font-semibold">HD <span className="text-[#cd1818]">Mobile</span></h1>
                     <i className="text-[14px]">'' Hắc đê mô bồ ''</i>
                  </div>
                  <div className="flex mt-[30px] md:mt-0 w-full sm:w-1/2">
                     <div className="w-1/2 md:w-1/3">
                        <h5 className="text-[16px] font-semibold">Liên hệ</h5>

                        <ul className="list">
                           <li>
                              <i className="material-icons mr-[4px]">phone</i>
                              0123456890
                           </li>
                           <li>
                              <i className="material-icons mr-[4px]">phone</i>
                              0123456890
                           </li>
                        </ul>
                     </div>

                     <div className="w-1/2 md:w-1/3">
                        <h5 className="text-[16px] font-semibold">Địa chỉ</h5>

                        <ul className="list">
                           <li>
                              <i className="material-icons mr-[4px]">location_on</i>
                              Tri Tôn, An Giang
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
