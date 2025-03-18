import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App";
import { BrowserRouter } from "react-router";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { DialogProvider } from "@/components/DialogProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <BrowserRouter>
        <DialogProvider>
          <App />
        </DialogProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  </StrictMode>
);
