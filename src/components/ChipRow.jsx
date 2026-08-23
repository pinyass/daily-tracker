const ChipRow = ({ options, value, onChange, labels }) => (
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
  
export default ChipRow