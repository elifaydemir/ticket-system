import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetTicketsQuery } from '../features/api.js'
import { useTranslation } from 'react-i18next'

export default function Profile() {
  const { t } = useTranslation()
  const { user } = useSelector(s => s.auth)
  const { data: myTickets } = useGetTicketsQuery({ ownerId: user.id })

  const stats = useMemo(() => {
    const s = { total: 0, open: 0, in_progress: 0, closed: 0 }
    if (myTickets?.length) {
      s.total = myTickets.length
      for (const ti of myTickets) { s[ti.status]++ }
    }
    return s
  }, [myTickets])

  return (
    <div className="row">
      <div className="card col">
        <h3 style={{marginTop:0}}>{t('profile')}</h3>
        <div className="stack">
          <div><div className="label">{t('username')}</div><div><strong>{user.username}</strong></div></div>
          <div><div className="label">{t('role')}</div><div><strong>{t(user.role)}</strong></div></div>
          <div><div className="label">ID</div><div className="muted">{user.id}</div></div>
        </div>
      </div>
      <div className="card col">
        <h3 style={{marginTop:0}}>{t('stats')}</h3>
        <div className="row">
          <div className="col"><div className="label">{t('total')}</div><div className="chip">{stats.total}</div></div>
          <div className="col"><div className="label">{t('openCount')}</div><div className="chip">{stats.open}</div></div>
          <div className="col"><div className="label">{t('inProgressCount')}</div><div className="chip">{stats.in_progress}</div></div>
          <div className="col"><div className="label">{t('closedCount')}</div><div className="chip">{stats.closed}</div></div>
        </div>
      </div>
    </div>
  )
}
