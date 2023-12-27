import classNames from "classnames/bind";
import styles from "./Footer.module.scss";

const cx = classNames.bind(styles);

function Footer() {
   return (
      <div className={cx("footer")}>
         <div className="container">
            <p>Nguyen Huu Dat © - 2023</p>
         </div>
      </div>
   );
}
export default Footer;
