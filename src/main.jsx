import React,{lazy,Suspense} from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./vant.css";

const Admin=lazy(()=>import('./Admin.jsx'));
const isAdmin=location.pathname.replace(/\/+$/,'')==='/admin';

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdmin?<Suspense fallback={<p className="page-loading" role="status">Abrindo painel…</p>}><Admin/></Suspense>:<App />}
  </React.StrictMode>,
);
