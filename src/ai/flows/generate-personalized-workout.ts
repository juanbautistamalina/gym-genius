// use server'
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized workout routines based on user inputs.
 *
 * The flow takes into account the user's fitness goals (strength, hypertrophy, endurance) and available equipment to recommend optimal exercises, sets, and reps ranges.
 *
 * - generatePersonalizedWorkout - The main function to trigger the workout generation flow.
 * - GeneratePersonalizedWorkoutInput - The input type for the generatePersonalizedWorkout function.
 * - GeneratePersonalizedWorkoutOutput - The output type for the generatePersonalizedWorkout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedWorkoutInputSchema = z.object({
  fitnessGoal: z
    .enum(['strength', 'hypertrophy', 'endurance'])
    .describe('The user selected fitness goal.'),
  availableEquipment: z
    .string()
    .describe(
      'A comma separated list of equipment available to the user in their gym or workout space.'
    ),
  workoutHistory: z
    .string()
    .optional()
    .describe(
      'Optional: A summary of the users workout history. This can be used to tailor the workout to their experience level. Omit if unknown.'
    ),
});
export type GeneratePersonalizedWorkoutInput = z.infer<typeof GeneratePersonalizedWorkoutInputSchema>;

const GeneratePersonalizedWorkoutOutputSchema = z.object({
  routine: z.string().describe('A workout routine as a JSON object where keys are days of the week (in Spanish, e.g., "Lunes") and values are arrays of exercises for that day.'),
});
export type GeneratePersonalizedWorkoutOutput = z.infer<typeof GeneratePersonalizedWorkoutOutputSchema>;

export async function generatePersonalizedWorkout(
  input: GeneratePersonalizedWorkoutInput
): Promise<GeneratePersonalizedWorkoutOutput> {
  return generatePersonalizedWorkoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedWorkoutPrompt',
  input: {schema: GeneratePersonalizedWorkoutInputSchema},
  output: {schema: GeneratePersonalizedWorkoutOutputSchema},
  prompt: `You are a personal workout trainer who specializes in creating workout routines for people.

You will generate a workout routine based on the users fitness goals and available equipment. The user is Spanish-speaking, so all output should be in Spanish.

Fitness Goal: {{{fitnessGoal}}}
Equipment: {{{availableEquipment}}}

{{#if workoutHistory}}
Workout History: {{{workoutHistory}}}
{{/if}}

Respond with just the workout routine. The workout routine should be output as a single JSON object.
The keys of the object should be the days of the week in Spanish (Lunes, Martes, Miércoles, etc.).
The value for each day should be an array of exercise objects.
Each exercise object should contain 'exercise', 'sets', and 'rep_range' in Spanish.
Be creative and don't use the same routine for everyone!
Distribute the exercises across 3 to 5 days, depending on what is appropriate for the goal.
`,
});

const generatePersonalizedWorkoutFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedWorkoutFlow',
    inputSchema: GeneratePersonalizedWorkoutInputSchema,
    outputSchema: GeneratePersonalizedWorkoutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
