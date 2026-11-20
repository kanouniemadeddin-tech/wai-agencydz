import { ChevronDown, ChevronUp } from 'lucide-react'

interface SlideNavProps {
  index: number
  count: number
  onPrev: () => void
  onNext: () => void
}

/** Fixed bottom-right slide controls: counter + prev/next. */
export function SlideNav({ index, count, onPrev, onNext }: SlideNavProps) {
  return (
    <div className="slide-nav-cluster">
      <span className="slide-counter" role="status" aria-label={`Section ${index + 1} of ${count}`}>
        {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </span>
      <div className="slide-nav">
        <button type="button" onClick={onPrev} disabled={index === 0} aria-label="Previous section">
          <ChevronUp size={18} aria-hidden="true" />
        </button>
        <button type="button" onClick={onNext} disabled={index === count - 1} aria-label="Next section">
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
