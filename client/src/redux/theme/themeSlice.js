import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: 'light',
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers:{ //this houses all the actions that can be dispatched to the reducer
        toggleTheme : (state) =>{
            state.theme = state.theme === 'light' ? 'dark' : 'light'
        }
    }
})

export const {toggleTheme}= themeSlice.actions

export default themeSlice.reducer // so we can add it ot the store

//notice we are separating themeSlice into actions and reducer. even tho in the store we only use themeSlice
//we are doing because actions and reducer has different functions. The themmeslice.reducer is the default export so it is the one that goes to the store
//it is what we use when we say 'theme: themeReducer' in the store.js
//the themeSlice.actions is used in the react code itself to dispatch the action to the reducer
//eg. dispatch(toggleTheme());



//after making this we went to the store to add the reducer 
//then to the main.jsx to cover the App.jsx with a new compoenent(ThemeProvider.jsx) that will
//wrap the App.jsx and control the whole app's theme change
//FINALLY we add the functionality to the moon icon inside the header
