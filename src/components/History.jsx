import { useEffect, useState } from 'react'
import * as store from '../lib/storage.js'

export default function History({ toast, refreshKey }) {
  const [dailyRows, setDailyRows] = useState([])
  const [workoutRows, setWorkoutRows] = useState([])

  const load = async () => {
    const dKeys = (await store.list('daily:')).sort().reverse().slice(0, 20)
    const dRows = await Promise.all(dKeys.map((k) => store.get(k)))
    setDailyRows(dRows.filter(Boolean))

    const wKeys = (await store.list('workout:')).sort().reverse().slice(0, 20)
    const wRows = await Promise.all(wKeys.map(async (k) => ({ key: k, ...(await store.get(k)) })))
    setWorkoutRows(wRows.filter((r) => r && r.date))
  }

  useEffect(() => { load() }, [refreshKey])

  const del = async (key) => {
    await store.remove(key)
    toast('Deleted')
    load()
  }

  const exportCsv = async () => {
    const keys = (await store.list('daily:')).sort().reverse().slice(0, 14)
    const rows = (await Promise.all(keys.map((k) => store.get(k)))).filter(Boolean).reverse()
    if (rows.length === 0) { toast('Nothing to export yet'); return }
    const tsv = rows
      .map((e) => {
        const dur = e.sleptAt && e.wokeAt ? sleepDurationStr(e.sleptAt, e.wokeAt) : ''
        const supplements = Object.entries(e.supplementTimes || {})
          .map(([n, t]) => `${n} @${t}`)
          .join(', ')
        return [
          e.date, e.positives || '', e.weight || '', e.steps || '', e.water || '',
          dur, e.workout || '', e.diet || '', e.deviations || '',
          supplements, e.walks || '', e.caffeine || '',
        ].join('\t')
      })
      .join('\n')
    try {
      await navigator.clipboard.writeText(tsv)
      toast(`Copied ${rows.length} rows`)
    } catch {
      toast('Copy failed — select & copy manually')
    }
  }

  return (
    <div>
      <div className="card">
        <h2>Export for Excel</h2>
        <div className="hint">
          Copies tab-separated rows for your last 14 daily logs (Date, positives, weight, steps, water,
          sleep duration, workout, diet, deviations, supplements, walks, caffeine) — paste starting at the{' '}
          <b>Date</b> column in "Daily tracking". Supplements/walks/caffeine are extra columns not in your
          original sheet — add them there if you want, or drop the last 3 values before pasting.
        </div>
        <button className="save-btn secondary" onClick={exportCsv}>Copy last 14 days</button>
      </div>

      <div className="card">
        <h2>Recent daily logs</h2>
        {dailyRows.length === 0 && <div className="hist-empty">Nothing logged yet</div>}
        {dailyRows.map((e) => (
          <div className="hist-entry" key={e.date}>
            <button className="del-btn" onClick={() => del('daily:' + e.date)}>delete</button>
            <div className="hist-date">{e.date}</div>
            <div className="hist-row">Wt {e.weight || '—'}kg · Steps {e.steps || '—'} · Water {e.water || '—'}</div>
            <div className="hist-row">
              Sleep {e.sleptAt || '—'} → {e.wokeAt || '—'}
              {e.sleptAt && e.wokeAt ? ` (${sleepDurationStr(e.sleptAt, e.wokeAt)})` : ''}
            </div>
            <div className="hist-row">
              Workout: {e.workout || '—'} · Diet: {e.diet || '—'}{e.deviations ? ' — ' + e.deviations : ''}
            </div>
            <div className="hist-row">
              Supplements: {Object.entries(e.supplementTimes || {}).map(([n, t]) => `${n} @${t}`).join(', ') || '—'}
              {' · '}Walks: {e.walks || '0'}/3 · Caffeine: {e.caffeine || '—'}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Recent workouts</h2>
        {workoutRows.length === 0 && <div className="hist-empty">Nothing logged yet</div>}
        {workoutRows.map((e) => (
          <div className="hist-entry" key={e.key}>
            <button className="del-btn" onClick={() => del(e.key)}>delete</button>
            <div className="hist-date">{e.date} — Day {e.day}</div>
            <div className="hist-row">
              {e.items.map((it) => it.cardio !== undefined
                ? `${it.n}: ${it.cardio || '—'}`
                : `${it.n}: ${(it.sets || []).join(', ') || '—'}`).join(' · ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function sleepDurationStr(sleptAt, wokeAt) {
  const [ah, am] = sleptAt.split(':').map(Number)
  const [bh, bm] = wokeAt.split(':').map(Number)
  let mins = bh * 60 + bm - (ah * 60 + am)
  if (mins <= 0) mins += 24 * 60
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}
