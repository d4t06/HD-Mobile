import CartLayout from "@/layouts/CartLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import AuthLayout from "@/layouts/AuthLayout";
import {
   Product,
   Home,
   Category,
   Banner,
   ProductDetail,
   DashboardProduct,
   EditProduct,
   Search,
   Login,
   Register,
   Unauthorized,
   Cart,
   UserOrder,
   UserOrderDetail,
   Dashboard,
} from "@/pages";
import DashboardRating from "@/pages/Dashboard/DashboardRating";

const routes = {
   HOME: "",
   CATEGORY: "/:category_ascii",
   LOGIN: "/login",
   REGISTER: "/register",
   SEARCH: "/search/:key",
   DETAIL: "/product/:productId",
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
      layout: AuthLayout,
   },
   {
      path: routes.REGISTER,
      component: Register,
      layout: AuthLayout,
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
      component: Cart,
      role: [],
      layout: CartLayout,
   },
   {
      path: routes.USER_ORDER,
      component: UserOrder,
      role: [],
      layout: CartLayout,
   },
   {
      path: routes.USER_ORDER_DETAIL,
      component: UserOrderDetail,
      role: [],
      layout: CartLayout,
   },
   {
      path: "/dashboard",
      role: ["ADMIN"],
      component: Dashboard,
   },
   {
      path: "/dashboard/product",
      role: ["ADMIN"],
      component: DashboardProduct,
   },
   {
      path: "/dashboard/category",
      role: ["ADMIN"],
      component: Category,
   },
   {
      path: "/dashboard/banner",
      role: ["ADMIN"],
      component: Banner,
   },
   {
      path: "/dashboard/product/:productId",
      role: ["ADMIN"],
      component: EditProduct,
   },
   {
      path: "/dashboard/rating",
      role: ["ADMIN"],
      component: DashboardRating,
   },
];
export { publicRoutes, privateRoutes, routes };
