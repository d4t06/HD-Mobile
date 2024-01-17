import rateImage from "@/assets/images/rate.png";

export default function NoComment({ title }: { title: string }) {
  return (
    <div className="text-center">
      <img src={rateImage} className="w-[200px] h-auto mx-[auto]" alt="" />
      <p className="text-[16px] mt-[10px] text-[#333]">{title}</p>
    </div>
  );
}
