import { useEffect, useState } from 'react'
import {
  Card, CardContent, Typography, TextField, InputAdornment, IconButton,
  Button, Box, Stack, Grid, FormControlLabel, Checkbox, Divider, Tooltip
} from '@mui/material'
import { AccessTime, Add, CheckCircle, ExpandMore, ExpandLess } from '@mui/icons-material'
import ChipRow from './ChipRow.jsx'
import {
  SUPPLEMENTS, WATER_OPTIONS, WORKOUT_OPTIONS, DIET_OPTIONS, WALK_OPTIONS, CAFFEINE_OPTIONS
} from '../data/plan.js'
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
  const [expandedSections, setExpandedSections] = useState({
    supplements: true,
    activities: true,
    positives: true,
  })

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

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
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
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Body & Activity</Typography>
          </Box>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Weight (kg)"
                type="number"
                step="0.1"
                placeholder="e.g. 86.2"
                value={entry.weight}
                onChange={(e) => patch({ weight: e.target.value })}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Steps"
                type="number"
                placeholder="e.g. 8500"
                value={entry.steps}
                onChange={(e) => patch({ steps: e.target.value })}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Water</Typography>
              <ChipRow
                options={WATER_OPTIONS}
                value={entry.water}
                onChange={(v) => patch({ water: v })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Sleep</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Slept at"
                    type="time"
                    value={entry.sleptAt}
                    onChange={(e) => patch({ sleptAt: e.target.value })}
                    fullWidth
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => patch({ sleptAt: nowHHMM() })}
                            aria-label="Set to now"
                            sx={{ p: 0 }}
                          >
                            <AccessTime fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Woke at"
                    type="time"
                    value={entry.wokeAt}
                    onChange={(e) => patch({ wokeAt: e.target.value })}
                    fullWidth
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => patch({ wokeAt: nowHHMM() })}
                            aria-label="Set to now"
                            sx={{ p: 0 }}
                          >
                            <AccessTime fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              {entry.sleptAt && entry.wokeAt && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {sleepDuration(entry.sleptAt, entry.wokeAt)}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Workout</Typography>
              <ChipRow
                options={WORKOUT_OPTIONS}
                value={entry.workout}
                onChange={(v) => patch({ workout: v })}
                labels={{ No: 'No (missed)' }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Diet</Typography>
          </Box>
          <ChipRow
            options={DIET_OPTIONS}
            value={entry.diet}
            onChange={(v) => patch({ diet: v })}
            labels={{ 'Yes - as per plan': 'As per plan', 'No - mentioned deviations': 'Deviated' }}
          />
          {entry.diet === 'No - mentioned deviations' && (
            <TextField
              label="What happened"
              multiline
              rows={3}
              placeholder="e.g. had a slice of cake at a birthday"
              value={entry.deviations}
              onChange={(e) => patch({ deviations: e.target.value })}
              fullWidth
              size="small"
              sx={{ mt: 2 }}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Supplements Taken</Typography>
            <Tooltip title={expandedSections.supplements ? 'Collapse' : 'Expand'}>
              <IconButton size="small" onClick={() => toggleSection('supplements')}>
                {expandedSections.supplements ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Tooltip>
          </Box>
          {expandedSections.supplements && (
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {SUPPLEMENTS.map((s) => (
                <Box
                  key={s.n}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: entry.supplementTimes[s.n] ? 'action.hover' : 'transparent',
                    border: entry.supplementTimes[s.n] ? '1px solid' : 'none',
                    borderColor: 'primary.main',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight={600} color={entry.supplementTimes[s.n] ? 'primary.main' : 'text.primary'}>
                      {s.n}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {s.hint}
                    </Typography>
                  </Box>
                  <TextField
                    type="time"
                    value={entry.supplementTimes[s.n] || ''}
                    onChange={(e) => setSupplementTime(s.n, e.target.value)}
                    size="small"
                    sx={{ width: 110 }}
                    InputProps={{
                      inputProps: { step: 60 },
                    }}
                  />
                  <Tooltip title="Set to now">
                    <IconButton
                      size="small"
                      onClick={() => setSupplementNow(s.n)}
                      aria-label={`Set ${s.n} to now`}
                      sx={{ p: 0, minWidth: 36 }}
                    >
                      <AccessTime fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Tap the clock icon the moment you take each one — or set the time manually. Leave blank if skipped.
              </Typography>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Other Activities</Typography>
            <Tooltip title={expandedSections.activities ? 'Collapse' : 'Expand'}>
              <IconButton size="small" onClick={() => toggleSection('activities')}>
                {expandedSections.activities ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Tooltip>
          </Box>
          {expandedSections.activities && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Post-meal walks (10 min each, target 3)
                </Typography>
                <ChipRow
                  options={WALK_OPTIONS}
                  value={entry.walks}
                  onChange={(v) => patch({ walks: v })}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Coffee / tea (max 2)
                </Typography>
                <ChipRow
                  options={CAFFEINE_OPTIONS}
                  value={entry.caffeine}
                  onChange={(v) => patch({ caffeine: v })}
                />
              </Box>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">
              Two Good Things Today
              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1, fontWeight: 400, textTransform: 'none' }}>
                (optional)
              </Typography>
            </Typography>
            <Tooltip title={expandedSections.positives ? 'Collapse' : 'Expand'}>
              <IconButton size="small" onClick={() => toggleSection('positives')}>
                {expandedSections.positives ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Tooltip>
          </Box>
          {expandedSections.positives && (
            <TextField
              multiline
              rows={3}
              placeholder="Anything at all..."
              value={entry.positives}
              onChange={(e) => patch({ positives: e.target.value })}
              fullWidth
              size="small"
              sx={{ mt: 1 }}
            />
          )}
        </CardContent>
      </Card>

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={save}
        startIcon={<CheckCircle />}
        sx={{ mt: 1, py: 1.5 }}
      >
        Save Today's Log
      </Button>
    </Stack>
  )
}

export default DailyLog