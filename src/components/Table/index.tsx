import { ReactNode } from "react";

import styles from "./Table.module.scss";
import classNames from "classnames/bind";

type Props = {
   colList: string[];
   children: ReactNode;
};

const cx = classNames.bind(styles);

function Table({ colList, children }: Props) {
   return (
      <table className={cx("table")}>
         <thead>
            <tr>
               {colList.map((item, index) => (
                  <th key={index}>{item}</th>
               ))}
            </tr>
         </thead>

         <tbody>{children}</tbody>
      </table>
   );
}

export default Table;
