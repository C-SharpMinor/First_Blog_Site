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
    version: 1,//this is so yo uknow the recency of your data. If you are making some new data format thatwill be version 2
}
const persistedReducer= persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
    // user: userReducer,  *previously used reducer, but now we have a root reducer that can house many reducers we just putt hat in 
    middleware: (getDefaultMiddleware) => 
        //getDefaultMiddleware is a default Redux Toolkit middleware that can be used for the following explanation
        getDefaultMiddleware({serializableCheck: false}), //setting the serializablecheck to false means preventing redux from ensuring that all states and actions are serializable(this means being able to be converted to json and normal js without losing any important information). Though it is generally a good practice to have the code serializable
    //prolly the guy teaching me set it to not make sure it is serializable cuz we'd be using non-serializable data like functions
      
})

export const persistor = persistStore(store)//this is gonna persist the store 
//so when a page is relaoded, and the user is still signed in , the user's details are not lost
//then the persistor is added to the main.jsx file by using the persistgate component



                //HOW ALL THIS WORKS
// persistConfig on it's own says what all the saved datat will be named in: 'root'. which is it's main role (choosing what state is saved). 
//then when you put persistConfig in persistReducer, it instructs the function what name to use to look for the data it saved ie look for 'root', where to save/persist the data and which version the data being published is 
//then you use that as your reducer to configure the store, note that you have not actually put your own reducers like userSlice. SO right now it's like you've made the store building with all the shelves where each item category will go but no store workers(reducers) to separate the info
//then you put the root reducer in the persitReducer() as well so the persist Reducer has the information it is supposed to put in the order made by the persistConfig
//Finally since we have persisted the reducer, it remains to persist the store, and we use the persistStore to do this.