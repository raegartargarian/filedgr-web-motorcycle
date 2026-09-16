import "@/styles/main.scss";
import "leaflet/dist/leaflet.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { GlobalProvider } from "./containers/global/index.tsx";
import { Web3AuthProvider } from "./containers/global/Web3AuthProvider.tsx";
import { store } from "./store";
import { configureExplorer } from "@filedgr/web-core/explorer";

if (import.meta.env.VITE_EXPLORER_URL) {
  configureExplorer({ baseUrl: import.meta.env.VITE_EXPLORER_URL });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Web3AuthProvider>
        <GlobalProvider />
        <App />
      </Web3AuthProvider>
    </Provider>
  </StrictMode>
);
