import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryProvider } from "./lib/QueryProvider.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { ActiveLinkContextProvider } from "./context/activeLinkContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NextUIProvider>
        <QueryProvider>
          <AuthContextProvider>
            <ActiveLinkContextProvider>
              <App />
            </ActiveLinkContextProvider>
          </AuthContextProvider>
        </QueryProvider>
      </NextUIProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
