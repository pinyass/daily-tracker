import { useState } from 'react'
import DailyLog from './components/DailyLog.jsx'
import WorkoutLog from './components/WorkoutLog.jsx'
import History from './components/History.jsx'

export default function App() {
  const [tab, setTab] = useState('daily')
  const [toastMsg, setToastMsg] = useState('')
  const [historyKey, setHistoryKey] = useState(0)

  const toast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 1600)
    setHistoryKey((k) => k + 1) // refresh history data whenever something is saved/deleted
  }

  return (
    <>
      <header>
        <h1>Daily Tracker</h1>
        <div className="sub">Log today, no spreadsheet needed</div>
      </header>

      <main>
        {tab === 'daily' && <DailyLog toast={toast} />}
        {tab === 'workout' && <WorkoutLog toast={toast} />}
        {tab === 'history' && <History toast={toast} refreshKey={historyKey} />}
      </main>

      <nav>
        <button className={tab === 'daily' ? 'active' : ''} onClick={() => setTab('daily')}>
          <span className="ico">📝</span>Daily Log
        </button>
        <button className={tab === 'workout' ? 'active' : ''} onClick={() => setTab('workout')}>
          <span className="ico">🏋️</span>Workout
        </button>
        <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>
          <span className="ico">📊</span>History
        </button>
      </nav>

      <div className={'toast' + (toastMsg ? ' show' : '')}>{toastMsg}</div>
    </>
  )
}
