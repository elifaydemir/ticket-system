import React from 'react'
export default function MessageList({ comments, meId }) {
  return (
    <div className="row" style={{flexDirection:'column', gap:'12px'}}>
      {comments?.length ? comments.map(c => (
        <div key={c.id} className={['comment', c.authorId===meId ? 'me' : ''].join(' ')}>
          <div className="stack">
            <strong>{c.authorName}</strong>
            <span className="muted">• {new Date(c.createdAt).toLocaleString()}</span>
          </div>
          <div style={{marginTop:6}}>{c.message}</div>
        </div>
      )) : <div className="empty">Henüz mesaj yok.</div>}
    </div>
  )
}
