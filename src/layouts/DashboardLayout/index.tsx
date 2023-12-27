import Header from './Header'
import DashboardSideBar from './SideBar';
import classNames from 'classnames/bind';
import styles from './DashboardLayout.module.scss'
import { ReactNode } from 'react';
import ToastPortal from '@/components/ToastPortal';

const cx = classNames.bind(styles)

function DashboardLayout({children}: {children: ReactNode}) {
   
   return (
      <div className="app">
         <Header />
         <DashboardSideBar/>
         <div className={cx("dashboard_wrapper", 'bg-[#f1f1f1]')}>
         {children}
         </div>

         <ToastPortal autoClose />
      </div>
   );
}

export default DashboardLayout;
