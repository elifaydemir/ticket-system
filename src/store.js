import { configureStore } from '@reduxjs/toolkit'
import authReducer, { persistAuth } from './features/authSlice.js'
import { api } from './features/api.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefault) => getDefault().concat(api.middleware)
})

export const attachPersistence = (s) => {
  s.subscribe(persistAuth(s))
}
