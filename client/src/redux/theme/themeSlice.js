import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: 'light',
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers:{
        toggleTheme : (state) =>{
            state.theme = state.theme === 'light' ? 'dark' : 'light'
        }
    }
})

export const {toggleTheme}= themeSlice.actions

export default themeSlice.reducer // so we can add it ot the store

//after making this we went to the store to add the reducer 
//then to the main.jsx to cover the App.jsx with a new compoenent(ThemeProvider.jsx) that will
//wrap the App.jsx and control the whole app's theme change
//FINALLY we add the functionality to the moon icon inside the header
