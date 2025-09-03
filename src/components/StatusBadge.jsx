import React from 'react'
import { useTranslation } from 'react-i18next'
export default function StatusBadge({ status }) {
  const { t } = useTranslation()
  return <span className={['badge','status-'+status].join(' ')}>{t(status)}</span>
}
