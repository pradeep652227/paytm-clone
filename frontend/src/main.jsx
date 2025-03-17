import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";
import { store, persistor } from "./utils/store/reduxStore.js";
ReactDOM.createRoot(document.getElementById("root")).render(
  
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>

);
