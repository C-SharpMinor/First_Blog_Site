import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './User/UserSlice'
import themeReducer from './theme/themeSlice'
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// the root reducer removes the need for various reducers
const rootReducer= combineReducers({
    user: userReducer,
    theme: themeReducer,
})

const persistConfig= {
    key: 'root', 
    storage,
    version: 1,
}
const persistedReducer= persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
    // user: userReducer,  *previously used reducer, but now we have a root reducer that can house many reducers we just putt hat in 
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({serializableCheck: false}), //setting the serializablecheck to false prevents erros using redux toolkit
  
})

export const persistor = persistStore(store)//this is gonna persist the store 
//so when a page is relaoded, and the user is still signed in , the user's details are not lost
//then the persistor is added to the main.jsx file by using the persistgate component