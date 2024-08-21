import notfoundImage from "@/assets/images/not-found.png";

export default function NoResult() {
   return (
      <div className="text-center">
         <img src={notfoundImage} alt="" className="mx-auto" />
         <p className="mt-2 font-medium">No result found, ¯\_(ツ)_/¯</p>
      </div>
   );
}
