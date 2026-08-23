import { useState } from 'react'
import { EXERCISES } from '../data/plan.js'
import * as store from '../lib/storage.js'

const todayStr = () => new Date().toISOString().slice(0, 10)
const DAYS = ['A', 'B', 'C', 'D', 'E']

export default function WorkoutLog({ toast }) {
  const [date, setDate] = useState(todayStr())
  const [day, setDay] = useState(null)
  // sets[exerciseIndex] = ['weightxreps', ...] ; cardio[exerciseIndex] = 'done text'
  const [sets, setSets] = useState({})
  const [cardio, setCardio] = useState({})

  const plan = day ? EXERCISES[day] : null

  const setSetValue = (exIdx, setIdx, field, value) => {
    setSets((prev) => {
      const forEx = prev[exIdx] ? [...prev[exIdx]] : []
      forEx[setIdx] = { ...(forEx[setIdx] || {}), [field]: value }
      return { ...prev, [exIdx]: forEx }
    })
  }

  const save = async () => {
    if (!day) { toast('Pick a workout day'); return }
    const items = plan.list.map((ex, i) => {
      if (ex.cardio) return { n: ex.n, cardio: cardio[i] || '' }
      const rows = (sets[i] || [])
        .map((s) => (s?.weight || s?.reps ? `${s.weight || ''}x${s.reps || ''}` : null))
        .filter(Boolean)
      return { n: ex.n, sets: rows }
    })
    await store.set('workout:' + date + ':' + day, { date, day, items })
    toast('Workout saved')
  }

  return (
    <div>
      <div className="card">
        <h2>Date</h2>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="card">
        <h2>Workout day</h2>
        <div className="day-select">
          {DAYS.map((d) => (
            <div key={d} className={'chip' + (day === d ? ' active' : '')} onClick={() => setDay(d)}>
              Day {d}
            </div>
          ))}
        </div>
        <div className="hint">Endurance target: 8k steps every day + 20 min treadmill cardio after each session.</div>
      </div>

      {plan && (
        <div className="card">
          <h2>{plan.note} — Day {day}</h2>
          {plan.list.map((ex, i) => (
            <div className="ex-item" key={i}>
              <div className="ex-name">{ex.n}</div>
              <div className="ex-target">
                {ex.cardio ? `Target: ${ex.reps}` : `Target: ${ex.sets} sets × ${ex.reps} reps`}
              </div>
              {ex.cardio ? (
                <div className="set-row">
                  <span>Done</span>
                  <input type="text" placeholder="e.g. 22 mins" value={cardio[i] || ''}
                    onChange={(e) => setCardio((c) => ({ ...c, [i]: e.target.value }))} />
                </div>
              ) : (
                Array.from({ length: ex.sets }).map((_, s) => (
                  <div className="set-row" key={s}>
                    <span>Set {s + 1}</span>
                    <input type="number" placeholder="kg" value={sets[i]?.[s]?.weight || ''}
                      onChange={(e) => setSetValue(i, s, 'weight', e.target.value)} />
                    <span className="x">×</span>
                    <input type="number" placeholder="reps" value={sets[i]?.[s]?.reps || ''}
                      onChange={(e) => setSetValue(i, s, 'reps', e.target.value)} />
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}

      <button className="save-btn" onClick={save}>Save workout</button>
    </div>
  )
}
