import classNames from "classnames/bind";
import Skeleton from ".";
import styles from "./Skeleton.module.scss";
// const cx = classNames.bind(styles);

export default function ProductSkeleton() {
   return <Skeleton className={'product-skeleton'}/>;
}
