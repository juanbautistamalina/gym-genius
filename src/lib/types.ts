export type WorkoutExercise = {
  id: string;
  exercise: string;
  sets: number;
  rep_range: string;
};

export type WorkoutDay = {
  day: string;
  exercises: WorkoutExercise[];
};
