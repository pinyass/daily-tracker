import { Chip, Stack } from '@mui/material'

const ChipRow = ({ options, value, onChange, labels }) => (
  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
    {options.map((opt) => (
      <Chip
        key={opt}
        label={labels?.[opt] ?? opt}
        variant={value === opt ? 'filled' : 'outlined'}
        color={value === opt ? 'primary' : 'default'}
        onClick={() => onChange(opt)}
        sx={{ height: 32, fontWeight: 500 }}
      />
    ))}
  </Stack>
)

export default ChipRow