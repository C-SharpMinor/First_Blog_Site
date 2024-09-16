import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux"; //added this when we just added the store and redux was managing it
import { store, persistor } from "./redux/store"; // added the 'store' fort he provider, added the 'persistor' when we added the redux persiting feature in the store.js
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
	<PersistGate persistor={persistor}>
		<Provider store={store}>
			<App />
		</Provider>
	</PersistGate>
);
