import { createSlice } from '@reduxjs/toolkit'

const stored = localStorage.getItem('authState')
const initial = stored ? JSON.parse(stored) : { isAuthenticated: false, user: null, language: 'tr' }

const slice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    loginSuccess: (state, action) => { state.isAuthenticated = true; state.user = action.payload },
    logout: (state) => { state.isAuthenticated = false; state.user = null },
    setLanguage: (state, action) => { state.language = action.payload }
  }
})

export const { loginSuccess, logout, setLanguage } = slice.actions
export default slice.reducer

let current
export const persistAuth = (store) => () => {
  const next = store.getState().auth
  if (next !== current) { current = next; localStorage.setItem('authState', JSON.stringify(next)) }
}
