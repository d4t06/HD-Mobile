import CheckoutLayout from "@/layouts/CheckoutLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import LoginLayout from "@/layouts/LoginLayout";
import {
   Product,
   Home,
   Brand,
   Banner,
   Account,
   ProductDetail,
   Dashboard,
   EditProduct,
   Search,
   Message,
   Review,
   Login,
   Register,
   Unauthorized,
} from "@/pages";
import Checkout from "@/pages/Checkout/Checkout";
import DashboardOrder from "@/pages/DashboardOrder";
import DashboardOrderDetail from "@/pages/DashboardOrderDetail";
import UserOrder from "@/pages/UserOrder";
import UserOrderDetail from "@/pages/UserOrderDetail";

const routes = {
   HOME: "",
   CATEGORY: "/:category_name_ascii",
   LOGIN: "/login",
   REGISTER: "/register",
   SEARCH: "/search/:key",
   DETAIL: "/:category/:key",
   UNAUTHORIZED: "/unauthorized",
   ACCOUNT: "/account",
   CHECKOUT: "/check-out",
   USER_ORDER: "/order",
   USER_ORDER_DETAIL: "/order/:id",
};

const publicRoutes = [
   {
      path: routes.LOGIN,
      component: Login,
      layout: LoginLayout,
   },
   {
      path: routes.REGISTER,
      component: Register,
      layout: LoginLayout,
   },
   {
      path: routes.HOME,
      component: Home,
      layout: DefaultLayout,
   },
   {
      path: routes.UNAUTHORIZED,
      component: Unauthorized,
      layout: DefaultLayout,
   },
   {
      path: routes.HOME,
      component: Home,
      layout: DefaultLayout,
   },

   {
      path: routes.ACCOUNT,
      component: Account,
      layout: DefaultLayout,
   },
   {
      path: routes.CATEGORY,
      component: Product,
      layout: DefaultLayout,
   },
   {
      path: routes.SEARCH,
      component: Search,
      layout: DefaultLayout,
   },
   {
      path: routes.DETAIL,
      component: ProductDetail,
      layout: DefaultLayout,
   },
];

const privateRoutes = [
   {
      path: routes.CHECKOUT,
      component: Checkout,
      role: [],
      layout: CheckoutLayout,
   },
   {
      path: routes.USER_ORDER,
      component: UserOrder,
      role: [],
      layout: CheckoutLayout,
   },
   {
      path: routes.USER_ORDER_DETAIL,
      component: UserOrderDetail,
      role: [],
      layout: CheckoutLayout,
   },
   {
      path: "/dashboard",
      role: ["ADMIN"],
      component: Dashboard,
   },
   {
      path: "/dashboard/brand",
      role: ["ADMIN"],
      component: Brand,
   },
   {
      path: "/dashboard/banner",
      role: ["ADMIN"],
      component: Banner,
   },
   {
      path: "/dashboard/product/edit/:id",
      role: ["ADMIN"],
      component: EditProduct,
   },
   {
      path: "/dashboard/order",
      role: ["ADMIN"],
      component: DashboardOrder,
   },
   {
      path: "/dashboard/order/:id",
      role: ["ADMIN"],
      component: DashboardOrderDetail,
   },
   {
      path: "/dashboard/message",
      role: ["ADMIN"],
      component: Message,
   },
   {
      path: "/dashboard/review",
      role: ["ADMIN"],
      component: Review,
   },
];
export { publicRoutes, privateRoutes, routes };
