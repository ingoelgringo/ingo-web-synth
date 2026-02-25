import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { KeyboardProvider } from "./contexts/KeyboardContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <KeyboardProvider>
      <App />
    </KeyboardProvider>
  </React.StrictMode>,
);
