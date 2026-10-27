import { useEffect, useState } from 'react'
import {
  Card, CardContent, Typography, Button, Box, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip, Paper, Divider
} from '@mui/material'
import { ContentCopy, Delete, TableChart, FitnessCenter } from '@mui/icons-material'
import * as store from '../lib/storage.js'

function sleepDurationStr(sleptAt, wokeAt) {
  if (!sleptAt || !wokeAt) return '—'
  const [ah, am] = sleptAt.split(':').map(Number)
  const [bh, bm] = wokeAt.split(':').map(Number)
  let mins = bh * 60 + bm - (ah * 60 + am)
  if (mins <= 0) mins += 24 * 60
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

function formatSupplements(supplementTimes) {
  if (!supplementTimes || Object.keys(supplementTimes).length === 0) return '—'
  return Object.entries(supplementTimes).map(([n, t]) => `${n} @${t}`).join(', ')
}

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
        const supp = Object.entries(e.supplementTimes || {}).map(([n, t]) => `${n}@${t}`).join(';')
        const sleepDur = e.sleptAt && e.wokeAt ? sleepDurationStr(e.sleptAt, e.wokeAt) : ''
        return [
          e.date, e.positives || '', e.weight || '', e.steps || '', e.water || '', sleepDur,
          e.workout || '', e.diet || '', e.deviations || '', supp, e.walks || '0', e.caffeine || ''
        ].join('\t')
      })
      .join('\n')
    const header = 'Date\tPositives\tWeight\tSteps\tWater\tSleep\tWorkout\tDiet\tDeviations\tSupplements\tWalks\tCaffeine\n'
    try {
      await navigator.clipboard.writeText(header + tsv)
      toast('Copied 14 days — paste into Daily tracking sheet')
    } catch {
      toast('Copy failed — select & copy manually')
    }
  }

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6">Export for Excel</Typography>
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={exportCsv}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Copy Last 14 Days
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            Copies tab-separated rows for your last 14 daily logs (Date, Positives, Weight, Steps, Water,
            Sleep Duration, Workout, Diet, Deviations, Supplements, Walks, Caffeine) — paste starting at the
            <strong>Date</strong> column in "Daily tracking". Supplements/Walks/Caffeine are extra columns not in your
            original sheet — add them there if you want, or drop the last 3 values before pasting.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <TableChart sx={{ mr: 1, verticalAlign: 'middle' }} /> Recent Daily Logs
          </Typography>
          {dailyRows.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              Nothing logged yet
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Weight / Steps / Water</TableCell>
                    <TableCell>Sleep</TableCell>
                    <TableCell>Workout / Diet</TableCell>
                    <TableCell>Supplements</TableCell>
                    <TableCell>Walks / Caffeine</TableCell>
                    <TableCell align="right" sx={{ width: 48, px: 1 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dailyRows.map((e) => (
                    <TableRow key={e.date} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{e.date}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {e.weight ? `${e.weight}kg` : '—'} · {e.steps ? `${e.steps}` : '—'} steps · Water: {e.water || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {e.sleptAt ? e.sleptAt : '—'} → {e.wokeAt ? e.wokeAt : '—'}
                          {e.sleptAt && e.wokeAt && ` (${sleepDurationStr(e.sleptAt, e.wokeAt)})`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          Workout: {e.workout || '—'} · Diet: {e.diet || '—'}
                          {e.deviations && ` — ${e.deviations}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatSupplements(e.supplementTimes)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          Walks: {e.walks || '0'}/3 · Caffeine: {e.caffeine || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ px: 1 }}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => del('daily:' + e.date)}
                          aria-label={`Delete ${e.date}`}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} /> Recent Workouts
          </Typography>
          {workoutRows.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              Nothing logged yet
            </Typography>
          ) : (
            workoutRows.map((e) => (
              <Paper key={e.key} variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {e.date} — Day {e.day}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => del(e.key)}
                      aria-label={`Delete workout ${e.date} Day ${e.day}`}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                  <Stack spacing={0.5} direction="column">
                    {e.items.map((it, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary">
                        {it.cardio !== undefined
                          ? `${it.n}: ${it.cardio || '—'}`
                          : `${it.n}: ${(it.sets || []).join(', ') || '—'}`}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Paper>
            ))
          )}
        </CardContent>
      </Card>
    </Stack>
  )
}