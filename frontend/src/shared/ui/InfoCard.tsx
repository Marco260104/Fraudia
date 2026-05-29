import type { ReactNode } from 'react'

type InfoCardProps = {
  title: string
  description: string
  icon?: ReactNode
  tone?: 'blue' | 'teal' | 'violet' | 'amber' | 'green' | 'rose'
}

export function InfoCard({ title, description, icon, tone = 'blue' }: InfoCardProps) {
  return (
    <article className={`info-card accent-${tone}`}>
      <div className="info-card-top">
        {icon ? <span className="info-card-icon">{icon}</span> : null}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}
