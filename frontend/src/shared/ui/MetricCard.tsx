type MetricCardProps = {
  value: string
  label: string
  detail?: string
}

export function MetricCard({ value, label, detail }: MetricCardProps) {
  return (
    <article className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
      {detail ? <p>{detail}</p> : null}
    </article>
  )
}
