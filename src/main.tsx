import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./store/AuthContext";
import { Provider } from "react-redux";
import store from "./store/store";
import "./index.css";
import AppProvider from "./store/AppContext";
import ToastProvider from "./store/ToastContext";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
   <React.StrictMode>
      <AppProvider>
         <Provider store={store}>
            <AuthProvider>
               <ToastProvider>
                  <App />
               </ToastProvider>
            </AuthProvider>
         </Provider>
      </AppProvider>
   </React.StrictMode>
);
