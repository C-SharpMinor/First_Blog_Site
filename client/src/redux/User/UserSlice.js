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


//i wondered where action.payload gets its information from. we are not assinging it to get it from the server or anything like that
//here's how it works. the reason action payload is here is because when you dispatch an actoin in the react app, it causes an action object to be automatically made. this is one of redux' features
// the action object contains where it is going to and the data you have assigned to it. For example,
// for dispatch(signInSuccess(payloadData)), the actoin object looks like this.
// {
//     type: "user/signInSuccess", // Automatically set by the slice name and reducer function name
//     payload: payloadData, // Whatever data you passed as the argument to the action
//   }

//so we make the reducer collect the payload and store it inside the state. Thus, we can use the state in the react app with useSelector

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
    
