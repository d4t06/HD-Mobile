export default function NoComment({ title }: { title: string }) {
   return (
      <div className="text-center">
         <img
            src={"https://zalo-api.zadn.vn/api/emoticon/sticker/webpc?eid=46985&size=130"}
            className="w-auto h-auto mx-auto"
            alt=""
         />
         <p className="text-[16px] mt-[10px] text-[#333]">{title}</p>
      </div>
   );
}
