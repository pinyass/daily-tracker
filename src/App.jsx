import { useState } from 'react'
import { Container, AppBar, Tabs, Tab, Toolbar, Typography, Box, Snackbar, Alert } from '@mui/material'
import { EditNote, FitnessCenter, Analytics } from '@mui/icons-material'
import DailyLog from './components/DailyLog.jsx'
import WorkoutLog from './components/WorkoutLog.jsx'
import History from './components/History.jsx'

export default function App() {
  const [tab, setTab] = useState(0)
  const [toastMsg, setToastMsg] = useState('')
  const [historyKey, setHistoryKey] = useState(0)

  const toast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 1600)
    setHistoryKey((k) => k + 1)
  }

  const tabs = [
    { id: 'daily', label: 'Daily Log', icon: <EditNote fontSize="small" sx={{ mr: 0.5 }} /> },
    { id: 'workout', label: 'Workout', icon: <FitnessCenter fontSize="small" sx={{ mr: 0.5 }} /> },
    { id: 'history', label: 'History', icon: <Analytics fontSize="small" sx={{ mr: 0.5 }} /> },
  ]

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={1} sx={{ zIndex: 1100 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Daily Tracker</Typography>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="main navigation"
            sx={{ minWidth: 0 }}
          >
            {tabs.map((t) => (
              <Tab key={t.id} label={t.label} icon={t.icon} />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flex: 1, py: 2, px: { xs: 1, sm: 2 } }}>
        {tab === 0 && <DailyLog toast={toast} />}
        {tab === 1 && <WorkoutLog toast={toast} />}
        {tab === 2 && <History toast={toast} refreshKey={historyKey} />}
      </Container>

      <Snackbar
        open={!!toastMsg}
        autoHideDuration={1600}
        onClose={() => setToastMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setToastMsg('')} sx={{ minWidth: 280 }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  )
}