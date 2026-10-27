import { useState } from 'react'
import {
  Card, CardContent, Typography, TextField, Button, Box, Stack, Grid,
  Chip, Tooltip, IconButton, Paper
} from '@mui/material'
import { FitnessCenter, ExpandMore, ExpandLess, Save, AddCircle } from '@mui/icons-material'
import { EXERCISES } from '../data/plan.js'
import * as store from '../lib/storage.js'

const todayStr = () => new Date().toISOString().slice(0, 10)
const DAYS = ['A', 'B', 'C', 'D', 'E']

export default function WorkoutLog({ toast }) {
  const [date, setDate] = useState(todayStr())
  const [day, setDay] = useState(null)
  const [sets, setSets] = useState({})
  const [cardio, setCardio] = useState({})
  const [expanded, setExpanded] = useState(true)

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
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Date</Typography>
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Workout Day</Typography>
          </Box>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1 }}>
            {DAYS.map((d) => (
              <Chip
                key={d}
                label={`Day ${d}`}
                variant={day === d ? 'filled' : 'outlined'}
                color={day === d ? 'primary' : 'default'}
                onClick={() => setDay(d)}
                sx={{ height: 36, fontWeight: 500 }}
              />
            ))}
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Endurance target: 8k steps every day + 20 min treadmill cardio after each session.
          </Typography>
        </CardContent>
      </Card>

      {plan && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">{plan.note} — Day {day}</Typography>
              <Tooltip title={expanded ? 'Collapse' : 'Expand'}>
                <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Tooltip>
            </Box>
            {expanded && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                {plan.list.map((ex, i) => (
                  <Paper key={i} variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>{ex.n}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.2 }}>
                          {ex.cardio ? `Target: ${ex.reps}` : `Target: ${ex.sets} sets × ${ex.reps} reps`}
                        </Typography>
                      </Box>
                    </Box>
                    {ex.cardio ? (
                      <TextField
                        label="Done"
                        placeholder="e.g. 22 mins"
                        value={cardio[i] || ''}
                        onChange={(e) => setCardio((c) => ({ ...c, [i]: e.target.value }))}
                        fullWidth
                        size="small"
                      />
                    ) : (
                      <Stack spacing={1}>
                        {Array.from({ length: ex.sets }).map((_, s) => (
                          <Grid container spacing={2} key={s} columns={12}>
                            <Grid item xs={12} sm={3}>
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                Set {s + 1}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Weight (kg)"
                                type="number"
                                placeholder="kg"
                                value={sets[i]?.[s]?.weight || ''}
                                onChange={(e) => setSetValue(i, s, 'weight', e.target.value)}
                                fullWidth
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Reps"
                                type="number"
                                placeholder="reps"
                                value={sets[i]?.[s]?.reps || ''}
                                onChange={(e) => setSetValue(i, s, 'reps', e.target.value)}
                                fullWidth
                                size="small"
                              />
                            </Grid>
                          </Grid>
                        ))}
                      </Stack>
                    )}
                  </Paper>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      )}

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={save}
        startIcon={<Save />}
        disabled={!day}
        sx={{ mt: 1, py: 1.5 }}
      >
        Save Workout
      </Button>
    </Stack>
  )
}