import {
   Product,
   Home,
   Login,
   Brand,
   Banner,
   Account,
   Register,
   ProductDetail,
   Dashboard,
   EditProduct,
   Unauthorized,
   Search,
   Order
} from "../pages";

import DashboardLayout from "../layouts/DashboardLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import Message from "@/pages/Message";
import Review from "@/pages/Review";

const routes = {
   HOME: "",
   CATEGORY: "/:category_ascii",
   LOGIN: "/login",
   REGISTER: "/register",
   SEARCH: "/search/:key",
   DETAIL: "/:category/:key",
   UNAUTHORIZED: "/unauthorized",
   ACCOUNT: "/account",
};

const publicRoutes = [
   {
      path: routes.HOME,
      component: Home,
      layout: DefaultLayout,
   },
   {
      path: routes.UNAUTHORIZED,
      component: Unauthorized,
   },
   {
      path: routes.LOGIN,
      component: Login,
      layout: null,
   },
   {
      path: routes.REGISTER,
      component: Register,
      layout: null,
   },
   {
      path: routes.ACCOUNT,
      component: Account,
   },
   {
      path: routes.CATEGORY,
      component: Product,
   },
   {
      path: routes.SEARCH,
      component: Search,
   },
   {
      path: routes.DETAIL,
      component: ProductDetail,
   },
];

const privateRoutes = [
   {
      path: "/dashboard",
      role: ["ADMIN"],
      component: Dashboard,
      layout: DashboardLayout,
   },
   {
      path: "/dashboard/brand",
      role: ["ADMIN"],
      component: Brand,
      layout: DashboardLayout,
   },
   {
      path: "/dashboard/banner",
      role: ["ADMIN"],
      component: Banner,
      layout: DashboardLayout,
   },
   {
      path: "/dashboard/product/edit/:id",
      role: ["ADMIN"],
      component: EditProduct,
      layout: DashboardLayout,
   },
   {
      path: "/dashboard/order",
      role: ["ADMIN"],
      component: Order,
      layout: DashboardLayout,
   },
   {
      path: "/dashboard/message",
      role: ["ADMIN"],
      component: Message,
      layout: DashboardLayout,
   },
   {
      path: "/dashboard/review",
      role: ["ADMIN"],
      component: Review,
      layout: DashboardLayout,
   },
];
export { publicRoutes, privateRoutes, routes };
