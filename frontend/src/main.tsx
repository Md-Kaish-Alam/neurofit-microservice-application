import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oauth2-code-pkce";

import "./index.css";
import App from "./App.tsx";
import store from "./store/store.ts";
import { authConfig } from "./config/authConfig";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider authConfig={authConfig}>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </StrictMode>
);
