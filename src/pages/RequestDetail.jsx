import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetTicketQuery, usePatchTicketMutation, useAddCommentMutation, useGetOperationsQuery, useAddOperationMutation } from '../features/api.js'
import StatusBadge from '../components/StatusBadge.jsx'
import MessageList from '../components/MessageList.jsx'
import { useTranslation } from 'react-i18next'

const nextStatus = (s) => s === 'open' ? 'in_progress' : (s === 'in_progress' ? 'closed' : 'closed')

export default function RequestDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const ticketId = Number(id) // ensure number-like
  const { data: ticket, isFetching } = useGetTicketQuery(ticketId)
  const { user } = useSelector(s => s.auth)
  const [patchTicket] = usePatchTicketMutation()
  const [addComment, { isLoading: adding }] = useAddCommentMutation()
  const { data: ops } = useGetOperationsQuery(ticketId)
  const [addOp, { isLoading: addingOp }] = useAddOperationMutation()
  const [message, setMessage] = useState('')

  if (isFetching) return <div className="card">Yükleniyor...</div>
  if (!ticket?.id) return <div className="card">Bulunamadı</div>

  const canUpdate = user.role === 'admin'

  const onUpdateStatus = async () => {
    const ns = nextStatus(ticket.status)
    await patchTicket({ id: ticket.id, status: ns })
  }

  const onAddComment = async (e) => {
    e.preventDefault()
    if (!message) return
    await addComment({ ticketId: ticket.id, authorId: user.id, authorName: user.username, message, createdAt: new Date().toISOString() })
    setMessage('')
  }

  return (
    <div className="row" style={{flexDirection:'column', gap:12}}>
      <div className="card">
        <div className="stack">
          <h3 style={{margin:'0 8px 0 0'}}>#{ticket.id} — {ticket.title}</h3>
          <StatusBadge status={ticket.status} />
          <span className="chip">{ticket.category}</span>
          <span className="muted right">{t('owner')}: <strong>{ticket.ownerName}</strong></span>
        </div>
        <p className="muted" style={{marginTop:8}}>{ticket.description}</p>
        <p className="muted" style={{marginTop:8}}>{t('createdAt')}: {new Date(ticket.createdAt).toLocaleString()}</p>

        <div className="stack" style={{marginTop:12, gap:8}}>
          {ticket.approved ? (
            <>
              <span className="chip">{t('approved')} ✅</span>
              {ticket.approvedByName && <span className="muted">{t('approvedBy')}: <strong>{ticket.approvedByName}</strong></span>}
              {ticket.approvedAt && <span className="muted">• {t('approvedAt')}: {new Date(ticket.approvedAt).toLocaleString()}</span>}
              {canUpdate && <button className="btn ghost" onClick={async () => { await patchTicket({ id: ticket.id, approved: false, approvedAt: null, approvedById: null, approvedByName: null }) }}>{t('revokeApproval')}</button>}
            </>
          ) : (
            canUpdate && <button className="btn secondary" onClick={async () => { await patchTicket({ id: ticket.id, approved: true, approvedAt: new Date().toISOString(), approvedById: user.id, approvedByName: user.username }) }}>{t('approve')}</button>
          )}
          {canUpdate && ticket.status !== 'closed' ? (
            <button className="btn" onClick={onUpdateStatus}>{t('updateStatus')}</button>
          ) : null}
        </div>
      </div>

      <div className="card">
        <h4 style={{marginTop:0}}>{t('messages')}</h4>
        <MessageList comments={ticket.comments || []} meId={user.id} />
        <form onSubmit={onAddComment} className="row" style={{marginTop:12}}>
          <div className="col" style={{flex:'1 1 auto'}}>
            <input className="input" placeholder={t('writeMessage')} value={message} onChange={e=>setMessage(e.target.value)} />
          </div>
          <div style={{alignSelf:'end'}}>
            <button className="btn" disabled={adding}>{t('addComment')}</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h4 style={{marginTop:0}}>{t('operations')}</h4>
        <div className="row" style={{flexDirection:'column', gap:8}}>
          {ops?.length ? ops.map(op => (
            <div key={op.id} className="stack">
              <span className="chip">{t(op.action) || op.action}</span>
              <span>{op.note}</span>
              <span className="muted">• {new Date(op.createdAt).toLocaleString()}</span>
              <span className="muted right">{op.authorName}</span>
            </div>
          )) : <div className="empty">Henüz işlem yok.</div>}
        </div>
        {canUpdate && (
          <form className="row" style={{marginTop:12}} onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            const action = fd.get('action')
            const note = fd.get('note')
            if (!action) return
            await addOp({ ticketId: ticket.id, action, note, authorId: user.id, authorName: user.username, createdAt: new Date().toISOString() })
            e.currentTarget.reset()
          }}>
            <div className="col">
              <label className="label">{t('action')}</label>
              <select className="input" name="action" defaultValue="assigned">
                <option value="assigned">{t('assigned')}</option>
                <option value="informed_customer">{t('informed_customer')}</option>
                <option value="requested_logs">{t('requested_logs')}</option>
                <option value="escalated">{t('escalated')}</option>
                <option value="resolved">{t('resolved')}</option>
                <option value="note_action">{t('note')}</option>
              </select>
            </div>
            <div className="col" style={{flexBasis:'100%'}}>
              <label className="label">{t('note')}</label>
              <input className="input" name="note" placeholder={t('operationPlaceholder')} />
            </div>
            <div className="col" style={{alignSelf:'end'}}>
              <button className="btn" disabled={addingOp}>{t('addOperation')}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
