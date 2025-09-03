import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetTicketsQuery, usePatchTicketMutation } from '../features/api.js'
import FilterBar from '../components/FilterBar.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useTranslation } from 'react-i18next'

const nextStatus = (s) => s === 'open' ? 'in_progress' : (s === 'in_progress' ? 'closed' : 'closed')

export default function Requests() {
  const { t } = useTranslation()
  const { user } = useSelector(s => s.auth)
  const [filters, setFilters] = useState({ q:'', category:'all', status:'all' })
  const params = useMemo(() => ({
    ownerId: user.role === 'user' ? user.id : undefined,
    filters
  }), [user, filters])

  const { data: tickets, isFetching } = useGetTicketsQuery(params)
  const [patchTicket] = usePatchTicketMutation()

  return (
    <div className="row" style={{flexDirection:'column', gap:12}}>
      <FilterBar filters={filters} setFilters={setFilters} />
      <div className="card">
        {isFetching ? <div className="empty">Yükleniyor...</div> : (
          tickets?.length ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t('title')}</th>
                  <th>{t('category')}</th>
                  <th>{t('status')}</th>
                  <th>{t('approved')}</th>
                  <th>{t('actions')}</th>
                  <th>{t('owner')}</th>
                  <th>{t('createdAt')}</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ti => (
                  <tr key={ti.id}>
                    <td>#{ti.id}</td>
                    <td><Link to={`/requests/${ti.id}`}>{ti.title}</Link></td>
                    <td><span className="chip">{ti.category}</span></td>
                    <td><StatusBadge status={ti.status} /></td>
                    <td>{ti.approved ? '✅' : '—'}</td>
                    <td>
                      {user.role === 'admin' ? (
                        <div className="stack">
                          {ti.approved ? (
                            <button className="btn ghost" onClick={() => patchTicket({ id: ti.id, approved: false, approvedAt: null, approvedById: null, approvedByName: null })}>
                              {t('revokeApproval')}
                            </button>
                          ) : (
                            <button className="btn secondary" onClick={() => patchTicket({ id: ti.id, approved: true, approvedAt: new Date().toISOString(), approvedById: user.id, approvedByName: user.username })}>
                              {t('approve')}
                            </button>
                          )}
                          {ti.status !== 'closed' && (
                            <button className="btn" onClick={() => patchTicket({ id: ti.id, status: nextStatus(ti.status) })}>
                              {t('updateStatus')}
                            </button>
                          )}
                        </div>
                      ) : '—'}
                    </td>
                    <td className="muted">{ti.ownerName}</td>
                    <td className="muted">{new Date(ti.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="empty">{t('noData')}</div>
        )}
      </div>
    </div>
  )
}
