export default function AvatarPlaceholder({ firstChar }: { firstChar: string }) {
   return (
      <div className="w-[44px] bg-[#f1f1f1] h-[44px] rounded-full flex items-center justify-center">
         <p className="text-xl text-[#3f3f3f] font-medium">{firstChar}</p>
      </div>
   );
}
