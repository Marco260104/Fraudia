type AssetFigureProps = {
  src: string
  title: string
  description: string
}

export function AssetFigure({ src, title, description }: AssetFigureProps) {
  return (
    <figure className="asset-figure">
      <img src={src} alt={title} loading="lazy" />
      <figcaption>
        <strong>{title}</strong>
        <span>{description}</span>
      </figcaption>
    </figure>
  )
}
