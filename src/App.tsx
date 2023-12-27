import { privateRoutes, publicRoutes } from "./routes";
import DefaultLayout from "./layouts/DefaultLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequireAuth from "./routes/RequireAuth";
import PersistLogin from "./routes/PersistLogin";

function App() {
   return (
      <Router basename="HD-Shop">
         <Routes>
            {/* <Route element={<PersistLogin />}> */}
            {publicRoutes.map((route, index) => {
               const Page = route.component;
               let Layout = DefaultLayout;
               if (route.layout) Layout = route.layout;

               return (
                  <Route
                     key={index}
                     path={route.path}
                     element={
                        route.layout === null ? (
                           <Page />
                        ) : (
                           <Layout>
                              <Page />
                           </Layout>
                        )
                     }
                  />
               );
            })}

            {privateRoutes.map((route, index) => {
               const Page = route.component;
               let Layout = DefaultLayout;
               if (route.layout) Layout = route.layout;

               return (
                  // <Route key={index} element={<RequireAuth allowedRole={route.role} />}>
                  <Route
                     key={index}
                     path={route.path}
                     element={
                        route.layout === null ? (
                           <Page />
                        ) : (
                           <Layout>
                              <Page />
                           </Layout>
                        )
                     }
                  />
                  // </Route>
               );
            })}
            {/* </Route> */}
         </Routes>
      </Router>
   );
}

export default App;
