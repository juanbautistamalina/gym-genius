'use client';

import { useState } from 'react';
import { WorkoutGeneratorForm } from '@/components/workout/workout-generator-form';
import { WorkoutDisplay } from '@/components/workout/workout-display';
import type { WorkoutDay } from '@/lib/types';
import { Logo } from '@/components/icons';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [workout, setWorkout] = useState<WorkoutDay[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWorkoutGenerated = (generatedWorkout: WorkoutDay[] | null) => {
    setWorkout(generatedWorkout);
    setError(null);
  };
  
  const handleGenerationError = (errorMessage: string | null) => {
    setError(errorMessage);
    setWorkout(null);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center gap-3 mb-6">
          <Logo className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
              GymGenius
            </h1>
            <p className="text-muted-foreground">Tu Entrenador Personal con IA</p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground/90">
                Crea Tu Rutina
              </h2>
              <WorkoutGeneratorForm
                onWorkoutGenerated={handleWorkoutGenerated}
                setIsLoading={setIsLoading}
                onError={handleGenerationError}
              />
            </div>
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-semibold mb-4 text-foreground/90">Tu Rutina</h2>
            <WorkoutDisplay
              initialWorkout={workout}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
        
        <footer className="mt-12 text-center text-muted-foreground">
          <Separator className="mb-4" />
          <p>&copy; {new Date().getFullYear()} GymGenius. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
