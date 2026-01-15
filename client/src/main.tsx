import { createRoot } from "react-dom/client";
import { ScrollToTop } from "./components/scroll-to-top";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <>
        <ScrollToTop />
        <App />
    </>
);
