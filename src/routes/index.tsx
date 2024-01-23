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
} from "@/pages";


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
