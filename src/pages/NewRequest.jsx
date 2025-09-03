import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useAddTicketMutation } from '../features/api.js'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NewRequest() {
  const { t } = useTranslation()
  const { user } = useSelector(s => s.auth)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('general')
  const [description, setDescription] = useState('')
  const [addTicket, { isLoading }] = useAddTicketMutation()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!title) return
    const now = new Date().toISOString()
    const body = { title, category, description, status: 'open', ownerId: user.id, ownerName: user.username, approved:false, createdAt: now }
    const res = await addTicket(body).unwrap()
    navigate(`/requests/${res.id}`)
  }

  return (
    <div className="card" style={{maxWidth: 720}}>
      <h3 style={{marginTop:0}}>{t('newRequest')}</h3>
      <form onSubmit={submit} className="row">
        <div className="col">
          <label className="label">{t('title')}</label>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Örn: Ödeme sorunu" />
        </div>
        <div className="col">
          <label className="label">{t('category')}</label>
          <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="general">general</option>
            <option value="billing">billing</option>
            <option value="technical">technical</option>
          </select>
        </div>
        <div className="col" style={{flexBasis:'100%'}}>
          <label className="label">{t('description')}</label>
          <textarea rows="5" className="input" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Detaylı açıklama..." />
        </div>
        <div className="col">
          <button className="btn" type="submit" disabled={isLoading}>{t('create')}</button>
        </div>
      </form>
    </div>
  )
}
