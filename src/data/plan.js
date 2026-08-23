export const EXERCISES = {
  A: {
    note: 'Push',
    list: [
      { n: 'Flat smith machine bench press', sets: 2, reps: '6-8' },
      { n: 'Pec dec fly', sets: 3, reps: '8-10' },
      { n: 'Lat pulldowns (wide grip)', sets: 2, reps: '6-10' },
      { n: 'Cable lateral raises', sets: 2, reps: '8-12' },
      { n: 'Standing db curls', sets: 2, reps: '8-10' },
      { n: 'Overhead triceps extensions', sets: 3, reps: '8-10' },
      { n: 'Cable/normal crunches', sets: 3, reps: '8-10' },
      { n: 'Cardio - treadmill', sets: 1, reps: '20 mins', cardio: true },
    ],
  },
  B: {
    note: 'Legs',
    list: [
      { n: 'Smith machine squats', sets: 3, reps: '8-10' },
      { n: 'Leg curls', sets: 3, reps: '8-10' },
      { n: 'Leg extensions (single leg)', sets: 2, reps: '8-10' },
      { n: 'Overhead shoulder press', sets: 2, reps: '8-12' },
      { n: 'Donkey calf raises', sets: 2, reps: '8-10' },
      { n: 'Smith machine shrugs', sets: 2, reps: '14-16' },
      { n: 'Cardio - treadmill', sets: 1, reps: '20 mins', cardio: true },
    ],
  },
  C: {
    note: 'Pull',
    list: [
      { n: 'Bentover row (chest supported)', sets: 3, reps: '6-10' },
      { n: 'Pec dec fly', sets: 2, reps: '6-10' },
      { n: 'Double hand lat pulldowns', sets: 2, reps: '8-10' },
      { n: 'Cable pullovers', sets: 3, reps: '8-10' },
      { n: 'Preacher curls', sets: 2, reps: '8-10' },
      { n: 'Hanging leg raises', sets: 2, reps: '8-10' },
      { n: 'Cardio - treadmill', sets: 1, reps: '20 mins', cardio: true },
    ],
  },
  D: {
    note: 'Legs',
    list: [
      { n: 'Leg curls', sets: 3, reps: '8-10' },
      { n: 'Romanian deadlift', sets: 3, reps: '6-10' },
      { n: 'Bulgarian split squats', sets: 3, reps: '6-10' },
      { n: 'Leg extensions (both legs)', sets: 3, reps: '8-10' },
      { n: 'Calf raises', sets: 2, reps: '8-10' },
      { n: 'Cardio - treadmill', sets: 1, reps: '20 mins', cardio: true },
    ],
  },
  E: {
    note: 'Upper',
    list: [
      { n: 'Cross body triceps extensions', sets: 3, reps: '8-10' },
      { n: 'Overhead shoulder press', sets: 2, reps: '6-10' },
      { n: 'Hip thrusts', sets: 3, reps: '6-10' },
      { n: 'Leg extensions (single leg)', sets: 2, reps: '8-10' },
      { n: 'Incline dumbbell curls', sets: 3, reps: '8-10' },
      { n: 'Cardio - treadmill', sets: 1, reps: '20 mins', cardio: true },
    ],
  },
}

export const SUPPLEMENTS = [
  { n: 'Magnesium', hint: 'Before sleeping' },
  { n: 'Iron', hint: 'Empty stomach' },
  { n: 'Zinc', hint: '1hr gap from meals' },
  { n: 'Vit D', hint: 'Post meal' },
  { n: 'Vit B12', hint: 'Post meal' },
  { n: 'Fish Oil', hint: 'Post meal' },
  { n: 'Whey', hint: 'With meal, as planned' },
]

export const WATER_OPTIONS = ['<2L', '2L+', '3L+', '4L+']
export const WORKOUT_OPTIONS = ['Yes', 'Cardio', 'Rest day', 'No']
export const DIET_OPTIONS = ['Yes - as per plan', 'No - mentioned deviations']
export const WALK_OPTIONS = ['0', '1', '2', '3']
export const CAFFEINE_OPTIONS = ['0', '1', '2', '2+']
