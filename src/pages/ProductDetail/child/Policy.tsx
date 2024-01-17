export default function Policy() {
  const classes = {
    text: "",
  };

  return (
    <div className={"p-[4px] bg-[#e1e1e1] pb-[10px] rounded-[8px] mt-[20px]"}>
      <div className="bg-white rounded-[6px]">
        <ul className="p-[10px]">
          <li className="flex items-center">
            <i className="material-icons text-[#cd1818] mr-[8px]">label_outline</i>
            <span className="text-[16px] text-[#333]">
              Hư gì đổi nấy 12 tháng tại 3384 siêu thị toàn quốc
            </span>
          </li>
          <li className="mt-[14px] flex items-center">
            <i className="material-icons text-[#cd1818] mr-[8px]">label_outline</i>

            <span className="text-[16px] text-[#333]">
              Bảo hành chính hãng điện thoại 12 tháng tại các trung tâm bảo hành hãng
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
