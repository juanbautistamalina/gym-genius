'use server';

import { generatePersonalizedWorkout, type GeneratePersonalizedWorkoutInput } from '@/ai/flows/generate-personalized-workout';
import type { WorkoutDay } from '@/lib/types';

export async function handleGenerateWorkout(input: GeneratePersonalizedWorkoutInput): Promise<{ data: WorkoutDay[] | null; error: string | null }> {
  try {
    const result = await generatePersonalizedWorkout(input);
    if (result?.routine) {
      // The AI returns a stringified JSON. Let's parse it safely.
      let parsedRoutine: { [day: string]: { ejercicio: string; series: number; repeticiones: string }[] };
      try {
        parsedRoutine = JSON.parse(result.routine);
      } catch (e) {
        console.error('JSON Parsing Error:', e, '--- Raw AI output:', result.routine);
        return { data: null, error: 'La IA devolvió un formato de respuesta no válido. Por favor, inténtalo de nuevo.' };
      }
      
      const routineWithIds: WorkoutDay[] = Object.entries(parsedRoutine).map(([day, exercises]) => ({
        day,
        exercises: exercises.map(ex => ({ 
          // The AI model should return the correct keys, but let's be safe
          exercise: (ex as any).ejercicio || ex.exercise || 'Ejercicio no especificado',
          sets: (ex as any).series || ex.sets || 3,
          rep_range: (ex as any).repeticiones || (ex as any).rep_range || '8-12',
          id: crypto.randomUUID() 
        }))
      }));

      return { data: routineWithIds, error: null };
    }
    return { data: null, error: 'No se pudo generar la rutina. El resultado de la IA estaba vacío.' };
  } catch (e) {
    console.error('Workout Generation Error:', e);
    const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
    
    if (errorMessage.toLowerCase().includes('billing') || errorMessage.toLowerCase().includes('api key')) {
        return { data: null, error: 'Error de configuración del servicio de IA. Comprueba tu clave de API y el estado de facturación.' };
    }

    return { data: null, error: `Ocurrió un error al generar la rutina: ${errorMessage}` };
  }
}
