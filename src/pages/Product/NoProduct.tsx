import classNames from "classnames/bind";
import styles from "./Products.module.scss";
import notfoundImage from "@/assets/images/not-found.png";
const cx = classNames.bind(styles);

const NoProduct = () => {
   return (
      <div className={cx("no-product")}>
         <img src={notfoundImage} alt="" />
         <p className="mt-2 font-medium">No product found, ¯\_(ツ)_/¯</p>
      </div>
   );
};

export default NoProduct;
