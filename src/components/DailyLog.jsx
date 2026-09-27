import { useEffect, useState } from 'react'
import ChipRow from './ChipRow.jsx'
import { SUPPLEMENTS, WATER_OPTIONS, WORKOUT_OPTIONS, DIET_OPTIONS, WALK_OPTIONS, CAFFEINE_OPTIONS } from '../data/plan.js'
import * as store from '../lib/storage.js'

const todayStr = () => new Date().toISOString().slice(0, 10)
const nowHHMM = () => {
  const d = new Date()
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}

const sleepDuration = (sleptAt, wokeAt) => {
  if (!sleptAt || !wokeAt) return 'Fill both times to see total sleep'
  const [ah, am] = sleptAt.split(':').map(Number)
  const [bh, bm] = wokeAt.split(':').map(Number)
  let mins = bh * 60 + bm - (ah * 60 + am)
  if (mins <= 0) mins += 24 * 60
  return `Total sleep: ${Math.floor(mins / 60)}h ${mins % 60}m`
}

const emptyEntry = (date) => ({
  date,
  weight: '',
  steps: '',
  water: '',
  sleptAt: '',
  wokeAt: '',
  workout: '',
  diet: '',
  deviations: '',
  supplementTimes: {},
  walks: '',
  caffeine: '',
  positives: '',
})

const DailyLog = ({ toast }) => {
  const [date, setDate] = useState(todayStr())
  const [entry, setEntry] = useState(emptyEntry(todayStr()))

  useEffect(() => {
    store.get('daily:' + date).then((saved) => {
      setEntry(saved ?? emptyEntry(date))
    })
  }, [date])

  const patch = (fields) => setEntry((e) => ({ ...e, ...fields }))

  const setSupplementNow = (name) => {
    setEntry((e) => ({
      ...e,
      supplementTimes: { ...e.supplementTimes, [name]: nowHHMM() },
    }))
  }
  const setSupplementTime = (name, time) => {
    setEntry((e) => {
      const st = { ...e.supplementTimes }
      if (time) st[name] = time
      else delete st[name]
      return { ...e, supplementTimes: st }
    })
  }

  const save = async () => {
    await store.set('daily:' + date, entry)
    toast('Saved ' + date)
  }

  return (
    <div>
      <div className="card">
        <h2>Date</h2>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="card">
        <h2>Body & activity</h2>
        <label>Weight (kg)</label>
        <input type="number" step="0.1" placeholder="e.g. 86.2" value={entry.weight}
          onChange={(e) => patch({ weight: e.target.value })} />
        <label>Steps</label>
        <input type="number" placeholder="e.g. 8500" value={entry.steps}
          onChange={(e) => patch({ steps: e.target.value })} />
        <label>Water</label>
        <ChipRow options={WATER_OPTIONS} value={entry.water} onChange={(v) => patch({ water: v })} />

        <label>Sleep</label>
        <div className="time-row">
          <div className="time-field">
            <span className="tf-label">Slept at</span>
            <input type="time" value={entry.sleptAt} onChange={(e) => patch({ sleptAt: e.target.value })} />
            <button type="button" className="now-btn" onClick={() => patch({ sleptAt: nowHHMM() })}>Now</button>
          </div>
          <div className="time-field">
            <span className="tf-label">Woke at</span>
            <input type="time" value={entry.wokeAt} onChange={(e) => patch({ wokeAt: e.target.value })} />
            <button type="button" className="now-btn" onClick={() => patch({ wokeAt: nowHHMM() })}>Now</button>
          </div>
        </div>
        <div className="hint">{sleepDuration(entry.sleptAt, entry.wokeAt)}</div>

        <label>Workout</label>
        <ChipRow options={WORKOUT_OPTIONS} value={entry.workout} onChange={(v) => patch({ workout: v })}
          labels={{ No: 'No (missed)' }} />
      </div>

      <div className="card">
        <h2>Diet</h2>
        <ChipRow options={DIET_OPTIONS} value={entry.diet} onChange={(v) => patch({ diet: v })}
          labels={{ 'Yes - as per plan': 'As per plan', 'No - mentioned deviations': 'Deviated' }} />
        {entry.diet === 'No - mentioned deviations' && (
          <>
            <label>What happened</label>
            <textarea placeholder="e.g. had a slice of cake at a birthday" value={entry.deviations}
              onChange={(e) => patch({ deviations: e.target.value })} />
          </>
        )}
      </div>

      <div className="card">
        <h2>Supplements taken</h2>
        {SUPPLEMENTS.map((s) => (
          <div key={s.n} className={'supp-item' + (entry.supplementTimes[s.n] ? ' logged' : '')}>
            <div className="supp-info">
              <div className="supp-name">{s.n}</div>
              <div className="supp-hint">{s.hint}</div>
            </div>
            <input type="time" className="supp-time" value={entry.supplementTimes[s.n] || ''}
              onChange={(e) => setSupplementTime(s.n, e.target.value)} />
            <button type="button" className="supp-now" onClick={() => setSupplementNow(s.n)}>Now</button>
          </div>
        ))}
        <div className="hint">Tap "Now" the moment you take each one — or set the time manually. Leave blank if skipped.</div>
      </div>

      <div className="card">
        <h2>Other activities</h2>
        <label>Post-meal walks (10 min each, target 3)</label>
        <ChipRow options={WALK_OPTIONS} value={entry.walks} onChange={(v) => patch({ walks: v })} />
        <label>Coffee / tea (max 2)</label>
        <ChipRow options={CAFFEINE_OPTIONS} value={entry.caffeine} onChange={(v) => patch({ caffeine: v })} />
      </div>

      <div className="card">
        <h2>Two good things today <span style={{ textTransform: 'none', color: 'var(--muted)' }}>(optional)</span></h2>
        <textarea placeholder="Anything at all..." value={entry.positives}
          onChange={(e) => patch({ positives: e.target.value })} />
      </div>

      <button className="save-btn" onClick={save}>Save today's log</button>
    </div>
  )
}

export default DailyLog