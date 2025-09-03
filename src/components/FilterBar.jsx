import React from 'react'
import { useTranslation } from 'react-i18next'
export default function FilterBar({ filters, setFilters }) {
  const { t } = useTranslation()
  return (
    <div className="card row">
      <div className="col">
        <label className="label">{t('searchByName')}</label>
        <input className="input" value={filters.q} onChange={e=>setFilters(s=>({...s,q:e.target.value}))} placeholder={t('title')} />
      </div>
      <div className="col">
        <label className="label">{t('category')}</label>
        <select className="input" value={filters.category} onChange={e=>setFilters(s=>({...s,category:e.target.value}))}>
          <option value="all">All</option>
          <option value="general">General</option>
          <option value="billing">Billing</option>
          <option value="technical">Technical</option>
        </select>
      </div>
      <div className="col">
        <label className="label">{t('status')}</label>
        <select className="input" value={filters.status} onChange={e=>setFilters(s=>({...s,status:e.target.value}))}>
          <option value="all">All</option>
          <option value="open">{t('open')}</option>
          <option value="in_progress">{t('in_progress')}</option>
          <option value="closed">{t('closed')}</option>
        </select>
      </div>
      <div className="col" style={{alignSelf:'end'}}>
        <button className="btn ghost" onClick={()=>setFilters({q:'',category:'all',status:'all'})}>{t('clear')}</button>
      </div>
    </div>
  )
}
