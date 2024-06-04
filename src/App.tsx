import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes";
import DashboardLayout from "./layouts/DashboardLayout";
import RequireAuth from "./routes/RequireAuth";
import { Fragment } from "react";
import PersistLogin from "./routes/PersistLogin";
import { Init } from "./pages";

function App() {
   return (
      <Router basename="/HD-Mobile">
         <Routes>
            <Route
               path="*"
               element={
                  <h1 className="mt-[30px] border-b text-center text-[20px]">
                     Not found
                  </h1>
               }
            />
            <Route path="/dashboard/init" element={<Init />} />

            <Route element={<PersistLogin />}>
               {publicRoutes.map((route, index) => {
                  const Page = route.component;

                  let Layout;
                  if (route.layout) Layout = route.layout;
                  else Layout = Fragment;

                  return (
                     <Route
                        key={index}
                        path={route.path}
                        element={
                           <Layout>
                              <Page />
                           </Layout>
                        }
                     />
                  );
               })}

               {privateRoutes.map((route, index) => {
                  const Page = route.component;

                  let Layout = DashboardLayout;
                  if (route.layout) Layout = route.layout;

                  return (
                     <Route
                        key={index}
                        element={<RequireAuth allowedRole={route.role} />}
                     >
                        <Route
                           key={index}
                           path={route.path}
                           element={
                              <Layout>
                                 <Page />
                              </Layout>
                           }
                        />
                     </Route>
                  );
               })}
            </Route>
         </Routes>
      </Router>
   );
}

export default App;
