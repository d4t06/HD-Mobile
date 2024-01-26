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
   Order,
   Message,
   Review,
   Login,
   Register,
   Unauthorized,
} from "@/pages";
import Checkout from "@/pages/Checkout/Checkout";

const routes = {
   HOME: "",
   CATEGORY: "/:category_ascii",
   LOGIN: "/login",
   REGISTER: "/register",
   SEARCH: "/search/:key",
   DETAIL: "/:category/:key",
   UNAUTHORIZED: "/unauthorized",
   ACCOUNT: "/account",
   CHECKOUT: "/check-out",
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
      component: Order,
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
