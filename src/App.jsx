import React, { useEffect } from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Requests from './pages/Requests.jsx'
import NewRequest from './pages/NewRequest.jsx'
import RequestDetail from './pages/RequestDetail.jsx'
import Profile from './pages/Profile.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from './features/authSlice.js'
import { useTranslation } from 'react-i18next'

function Private({ children }) {
  const isAuth = useSelector(s => s.auth.isAuthenticated)
  return isAuth ? children : <Navigate to="/login" replace />
}

function NonAdminOnly({ children }) {
  const { user } = useSelector(s => s.auth)
  return user?.role === 'admin' ? <Navigate to="/requests" replace /> : children
}

export default function App() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user, language } = useSelector(s => s.auth)

  useEffect(() => { i18n.changeLanguage(language) }, [language, i18n])

  return (
    <div className="container">
      <header className="header">
        <Link to={isAuthenticated ? "/requests" : "/login"}><h2 style={{margin:0}}>{t('appTitle')}</h2></Link>
        {isAuthenticated ? (
          <nav className="nav">
            <Link to="/requests" className="chip">{user.role === 'admin' ? t('allRequests') : t('myRequests')}</Link>
            {user.role !== 'admin' && <Link to="/new-request" className="chip">{t('newRequest')}</Link>}
            <Link to="/profile" className="chip">{t('profile')}</Link>
            <button className="btn ghost" onClick={() => { dispatch(logout()); navigate('/login') }}>{t('logout')}</button>
          </nav>
        ) : null}
      </header>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/requests" element={<Private><Requests /></Private>} />
        <Route path="/new-request" element={<Private><NonAdminOnly><NewRequest /></NonAdminOnly></Private>} />
        <Route path="/requests/:id" element={<Private><RequestDetail /></Private>} />
        <Route path="/profile" element={<Private><Profile /></Private>} />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/requests' : '/login'} replace />} />
      </Routes>
    </div>
  )
}
