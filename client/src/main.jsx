import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux"; //added this when we just added the store and redux was managing it
import { store, persistor } from "./redux/store"; // added the 'store' fort he provider, added the 'persistor' when we added the redux persiting feature in the store.js
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./components/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
	<PersistGate persistor={persistor}>
		<Provider store={store}>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</Provider>
	</PersistGate>
);

//we are passing persistor in provideGate cuz the gate needs to persist the store to regulate rehydration. Obvi we are passigns to store into Provider cuz it connects it to the app.jsx

//the functional idea behind this is that normally, <App> is alone but now it interacts with the store through <provider>
//when the app accesses the store, the sata it receives is stored/persisted by the persistGate. just how the persitReducer is used to persist reducers and persistor was used to persist the store

//now you might ask: why are we using PersistGate to persist the stored states again when we have done that with persistStore and persistReducer?
//the reason is the Persistor gate is like the gate of the library of books (stored data/states). It makes sure that the previously saved states are fully reloaded from storage when you open a new page or relaod the page
//it is like the gatekeeper of the library. without it, when the page is loaded, the store might open without the imfo being fully reloaded(proper term: rehydrated), so it'll be showing like incomplete info
