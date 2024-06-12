import {configureStore, createSlice} from '@reduxjs/toolkit'
import users from '../data/users.json'

const roomSlice = createSlice({
    name: 'chatbotflow',
    initialState: {
        users: users
    },
    reducers: {
    }
})

export const {

} = roomSlice.actions

const store = configureStore({
    reducer: roomSlice.reducer
})

export default store;