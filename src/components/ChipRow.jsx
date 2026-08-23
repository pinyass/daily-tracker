export default function ChipRow({ options, value, onChange, labels }) {
  return (
    <div className="chip-row">
      {options.map((opt) => (
        <div
          key={opt}
          className={'chip' + (value === opt ? ' active' : '')}
          onClick={() => onChange(opt)}
        >
          {labels?.[opt] ?? opt}
        </div>
      ))}
    </div>
  )
}
