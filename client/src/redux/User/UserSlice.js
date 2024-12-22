import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: 'user',
    loading: false}

    const userSlice = createSlice({
        name: 'user',
        initialState,
        reducers: {
            signInStart: (state)=>{
                state.loading = true;
                state.error= null;
            },
            signInSuccess: (state, action)=>{
                state.loading = false;
                state.currentUser = action.payload;
            },
            signInFailure: (state, action)=>{
                state.loading = false;
                state.error = action.payload;
            },
            updateStart: (state) =>{
                state.loading = true;
                state.error = null
            },
            updateSuccess: (state, action) =>{
                state.currentUser= action.payload
                state.loading = false;
                state.error = null
            },
            updateFailure: (state, action) =>{
                state.loading = false;
                state.error = action.payload
            },
            deleteUserStart: (state) =>{
                state.currentUser = null;
                state.loading = true;
                state.error = null
            },
            deleteUserSuccess: (state) =>{ 
                state.currentUser = null; //we're setting this to null unlike action.payload of the others cuz when we delete the data should no longer be there 
                state.loading = false;
                state.error = null
            },
            deleteUserFailure: (state, action) =>{
                state.currentUser = null;
                state.loading = false;
                state.error = action.payload
            },
            signOutSuccess: (state)=>{
                state.currentUser= null;
                state.error= null;
                state.loading= false;
            },
        } 
    })

    export const {signInStart,
         signInSuccess, 
         signInFailure, 
         updateStart, 
         updateSuccess, 
         updateFailure, 
         deleteUserFailure, 
         deleteUserStart, 
         deleteUserSuccess,
        signOutSuccess } = userSlice.actions
    
        //we need to export these from UserSlice.actions so the reducers basically become actions. This means when you call them with dispatch(), they are reconized as the reducers actoin

    export default userSlice.reducer
    //this is what is called in the store when we say import userReducer ...
    