import { Input } from "@/components";
import { inputClasses } from "@/components/ui/Input";
import { Ref, forwardRef, useImperativeHandle, useState } from "react";

export type OrderAddress = {
   name: string;
   gender: "male" | "female";
   address: string;
   phoneNumber: string;
};

export type AddressGroupRef = {
   getAddress: () => OrderAddress;
   validate: () => boolean;
};
function AddressGroup({}, ref: Ref<AddressGroupRef>) {
   const classes = {
      formLabel: "text-[16px] text-[#3f3f3f] font-[500]",
   };

   const [address, setAddress] = useState<OrderAddress>({
      address: "",
      gender: "male",
      name: "",
      phoneNumber: "",
   });

   const handleAddress = (value: string, field: keyof OrderAddress) => {
      setAddress((prev) => ({ ...prev, [field]: value }));
   };

   const validate = () => {
      return (
         !!address.address &&
         !!address.name &&
         !!address.phoneNumber &&
         !!address.gender
      );
   };

   useImperativeHandle(ref, () => ({ getAddress: () => address, validate }));

   return (
      <div className="space-y-[14px]">
         <div className="space-y-[6px]">
            <label className={classes.formLabel} htmlFor="name">
               Full name
            </label>
            <Input
               value={address.name}
               id="name"
               cb={(v) => handleAddress(v, "name")}
               type="text"
            />
         </div>
         <div className="space-y-[6px]">
            <label className={classes.formLabel} htmlFor="phone-number">
               Phone number
            </label>
            <Input
               id="phone-number"
               cb={(v) => handleAddress(v, "phoneNumber")}
               type="text"
            />
         </div>
         <div className="space-y-[6px]">
            <label className={classes.formLabel} htmlFor="location">
               Address
            </label>
            <textarea
               onChange={(e) => handleAddress(e.target.value, "address")}
               id="location"
               className={inputClasses.input}
            />
         </div>
      </div>
   );
}

export default forwardRef(AddressGroup);
