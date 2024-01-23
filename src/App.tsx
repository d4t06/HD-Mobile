// import { privateRoutes, publicRoutes } from "./routes";
import DefaultLayout from "./layouts/DefaultLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import RequireAuth from "./routes/RequireAuth";
// import PersistLogin from "./routes/PersistLogin";
import { Unauthorized } from "./pages";
// import LoginLayout from "./layouts/LoginLayout";
// import DashboardLayout from "./layouts/DashboardLayout";
// import DetailPage from "./pages/ProductDetail";
import PersistLogin from "./routes/PersistLogin";
import { publicRoutes } from "./routes";

function App() {
   return (
      <Router basename="/HD-Mobile">
         <Routes>
            {/* <Route element={<PersistLogin />}>
               <Route
                  path={"/login"}
                  element={
                     <LoginLayout>
                        <Login />
                     </LoginLayout>
                  }
               />
            </Route> */}

            {/* <Route
               path={"/register"}
               element={
                  <LoginLayout>
                     <Register />
                  </LoginLayout>
               }
            /> */}
            <Route path={"/unauthorized"} element={<Unauthorized />} />
            <Route path="*" element={<h1>Not found</h1>} />

            {/* <Route
               path={"/"}
               element={
                  <DefaultLayout>
                     <Home />
                  </DefaultLayout>
               }
            />

            <Route
               path={"/:category_ascii"}
               element={
                  <DefaultLayout>
                     <Product />
                  </DefaultLayout>
               }
            />

            <Route
               path={"/:category/:key"}
               element={
                  <DefaultLayout>
                     <DetailPage />
                  </DefaultLayout>
               }
            /> */}

            <Route element={<PersistLogin />}>
               {publicRoutes.map((route, index) => {
                  const Page = route.component;

                  return (
                     <Route
                        key={index}
                        path={route.path}
                        element={
                           <DefaultLayout>
                              <Page />
                           </DefaultLayout>
                        }
                     />
                  );
               })}

               {/* {privateRoutes.map((route, index) => {
                  const Page = route.component;
                  return (
                     <Route key={index} element={<RequireAuth allowedRole={route.role} />}>
                        <Route
                           key={index}
                           path={route.path}
                           element={
                              <DashboardLayout>
                                 <Page />
                              </DashboardLayout>
                           }
                        />
                     </Route>
                  );
               })} */}
            </Route>
         </Routes>
      </Router>
   );
}

export default App;
