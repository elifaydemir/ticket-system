import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess, setLanguage } from '../features/authSlice.js'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../features/api.js'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [lang, setLang] = useState('tr')
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [login] = useLoginMutation()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await login({ username, password }).unwrap()
      dispatch(loginSuccess({ id: res.id, username: res.username, role: res.role }))
      dispatch(setLanguage(lang))
      i18n.changeLanguage(lang)
      navigate('/requests')
    } catch (err) {
      setError(t('invalidLogin'))
    }
  }

  return (
    <div className="card" style={{maxWidth:480, margin:'80px auto'}}>
      <h3 style={{marginTop:0}}>{t('login')}</h3>
      <div className='dis-flex'>
      <div className="column width-auto" >
          <select className="input width-auto" value={lang} onChange={e=>{setLang(e.target.value);  dispatch(setLanguage(e.target.value)); i18n.changeLanguage(e.target.value)}}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
      <form onSubmit={onSubmit} className="row">
        <div className="col">
          <label className="label">{t('username')}</label>
          <input className="input" value={username} onChange={e=>setUsername(e.target.value)} placeholder={t('username')} />
        </div>
        <div className="col">
          <label className="label">{t('password')}</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={t('password')} />
        </div>
        {error && <div className="col" style={{color:'salmon'}}>{error}</div>}
        <div className="col">
          <button className="btn" type="submit">{t('continue')}</button>
        </div>
      </form>
    </div>
  )
}
