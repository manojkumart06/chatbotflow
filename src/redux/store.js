import {configureStore, createSlice} from '@reduxjs/toolkit'
import users from '../data/users.json'

// Creating a slice for the chatbot flow
const roomSlice = createSlice({
    name: 'chatbotflow', // Name of the slice
    initialState: {
        users: users // Initial state includes users from the imported JSON file
    },
    reducers: {
        // Reducers will be added here if needed in the future
    }
});

// export const {

// } = roomSlice.actions

const store = configureStore({
    reducer: roomSlice.reducer
})

export default store;