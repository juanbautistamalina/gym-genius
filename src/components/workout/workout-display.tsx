'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { PlusCircle, Trash2, FileDown, Printer, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { WorkoutDay, WorkoutExercise } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type WorkoutDisplayProps = {
  initialWorkout: WorkoutDay[] | null;
  isLoading: boolean;
  error: string | null;
};

export function WorkoutDisplay({ initialWorkout, isLoading, error }: WorkoutDisplayProps) {
  const [workout, setWorkout] = useState<WorkoutDay[]>([]);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (initialWorkout) {
      setWorkout(initialWorkout);
      const initialCompletedSets: Record<string, boolean[]> = {};
      initialWorkout.forEach(day => {
        day.exercises.forEach(ex => {
          initialCompletedSets[ex.id] = Array(ex.sets).fill(false);
        });
      });
      setCompletedSets(initialCompletedSets);
    } else {
      setWorkout([]);
    }
  }, [initialWorkout]);
  
  const handleInputChange = (dayIndex: number, exerciseId: string, field: keyof WorkoutExercise, value: string | number) => {
    setWorkout(currentWorkout =>
      currentWorkout.map((day, dIndex) => {
        if (dIndex === dayIndex) {
          return {
            ...day,
            exercises: day.exercises.map(ex => 
              ex.id === exerciseId ? { ...ex, [field]: value } : ex
            )
          };
        }
        return day;
      })
    );
  };
  
  const handleSetCountChange = (dayIndex: number, exerciseId: string, newSetCount: number) => {
    const oldSetCount = workout[dayIndex]?.exercises.find(ex => ex.id === exerciseId)?.sets || 0;
    newSetCount = Math.max(0, newSetCount);
    
    handleInputChange(dayIndex, exerciseId, 'sets', newSetCount);
    setCompletedSets(prev => {
      const newCompleted = [...(prev[exerciseId] || [])];
      if (newSetCount > oldSetCount) {
        newCompleted.push(...Array(newSetCount - oldSetCount).fill(false));
      } else {
        newCompleted.length = newSetCount;
      }
      return { ...prev, [exerciseId]: newCompleted };
    });
  };

  const handleToggleSet = (exerciseId: string, setIndex: number) => {
    setCompletedSets(prev => {
      const newCompleted = [...prev[exerciseId]];
      newCompleted[setIndex] = !newCompleted[setIndex];
      return { ...prev, [exerciseId]: newCompleted };
    });
  };

  const addExercise = (dayIndex: number) => {
    const newId = crypto.randomUUID();
    const newExercise: WorkoutExercise = {
      id: newId,
      exercise: '',
      sets: 3,
      rep_range: '8-12',
    };
    
    setWorkout(currentWorkout => 
      currentWorkout.map((day, dIndex) => {
        if(dIndex === dayIndex) {
          return {...day, exercises: [...day.exercises, newExercise]}
        }
        return day;
      })
    );
    setCompletedSets(prev => ({...prev, [newId]: Array(3).fill(false)}));
  };

  const deleteExercise = (dayIndex: number, exerciseId: string) => {
    setWorkout(currentWorkout => 
      currentWorkout.map((day, dIndex) => {
        if(dIndex === dayIndex) {
          return {...day, exercises: day.exercises.filter(ex => ex.id !== exerciseId)}
        }
        return day;
      })
    );
    setCompletedSets(prev => {
      const newCompleted = {...prev};
      delete newCompleted[exerciseId];
      return newCompleted;
    });
  };

  const handleExport = () => {
    if (workout.length === 0) {
        toast({
            variant: 'destructive',
            title: 'No hay rutina para exportar',
            description: 'Primero genera una rutina antes de exportarla.',
        });
        return;
    }
    const wb = XLSX.utils.book_new();

    workout.forEach(day => {
        const dataToExport = day.exercises.map(ex => ({
            'Ejercicio': ex.exercise,
            'Series': ex.sets,
            'Repeticiones': ex.rep_range
        }));
        
        if (dataToExport.length > 0) {
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            
            const cols = Object.keys(dataToExport[0]).map(key => ({
                wch: Math.max(key.length, ...dataToExport.map(row => row[key as keyof typeof row]?.toString().length || 0)) + 2
            }));
            ws['!cols'] = cols;
            
            const dayName = day.day.replace(/[^a-zA-Z0-9]/g, '').substring(0, 31);
            XLSX.utils.book_append_sheet(wb, ws, dayName);
        }
    });

    XLSX.writeFile(wb, 'GymGenius-Rutina.xlsx');
    toast({ title: '¡Exportado a Excel!', description: 'Tu rutina ha sido guardada como un archivo .xlsx.' });
  };
  
  const handlePrint = () => {
    if (workout.length === 0) {
      toast({
            variant: 'destructive',
            title: 'No hay rutina para imprimir',
            description: 'Primero genera una rutina antes de imprimirla.',
        });
      return;
    };
    window.print();
  };

  const resetWorkout = () => {
    if(initialWorkout) {
        setWorkout(initialWorkout);
        const initialCompletedSets: Record<string, boolean[]> = {};
        initialWorkout.forEach(day => {
          day.exercises.forEach(ex => {
            initialCompletedSets[ex.id] = Array(ex.sets).fill(false);
          });
        });
        setCompletedSets(initialCompletedSets);
        toast({ title: "Rutina Reiniciada", description: "Tu rutina ha sido restaurada a la versión original generada." });
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!workout || workout.length === 0) {
      return (
        <div className="text-center py-16 border-2 border-dashed border-muted-foreground/30 rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground">Tu rutina aparecerá aquí.</h3>
          <p className="text-sm text-muted-foreground/70">Completa el formulario para generar una nueva rutina.</p>
        </div>
      );
    }
    
    return (
      <TooltipProvider>
      <div className="printable-area space-y-4">
        <Accordion type="multiple" defaultValue={workout.map(d => d.day)} className="w-full">
            {workout.map((day, dayIndex) => (
              <AccordionItem value={day.day} key={day.day}>
                <AccordionTrigger className="text-xl font-semibold text-primary">
                  {day.day}
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[35%]">Ejercicio</TableHead>
                        <TableHead className="text-center">Series</TableHead>
                        <TableHead>Reps</TableHead>
                        <TableHead className="text-center w-[25%] no-print">Completado</TableHead>
                        <TableHead className="w-[50px] no-print"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {day.exercises.map(ex => (
                        <TableRow key={ex.id}>
                          <TableCell>
                            <Input
                              value={ex.exercise}
                              onChange={e => handleInputChange(dayIndex, ex.id, 'exercise', e.target.value)}
                              className="border-none focus-visible:ring-1"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={ex.sets}
                              onChange={e => handleSetCountChange(dayIndex, ex.id, parseInt(e.target.value, 10))}
                              className="w-16 text-center border-none focus-visible:ring-1"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={ex.rep_range}
                              onChange={e => handleInputChange(dayIndex, ex.id, 'rep_range', e.target.value)}
                              className="border-none focus-visible:ring-1"
                            />
                          </TableCell>
                          <TableCell className="no-print">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {[...Array(ex.sets)].map((_, i) => (
                                <Tooltip key={i}>
                                  <TooltipTrigger asChild>
                                    <Checkbox
                                      checked={completedSets[ex.id]?.[i]}
                                      onCheckedChange={() => handleToggleSet(ex.id, i)}
                                      aria-label={`Marcar serie ${i + 1} para ${ex.exercise} como completa`}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Serie {i+1}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="no-print">
                            <Button variant="ghost" size="icon" onClick={() => deleteExercise(dayIndex, ex.id)}>
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-2 no-print">
                    <Button variant="ghost" size="sm" onClick={() => addExercise(dayIndex)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir Ejercicio
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
       <div className="mt-6 flex flex-col sm:flex-row gap-2 no-print">
          <div className="flex-grow" />
          <Button variant="outline" onClick={resetWorkout} disabled={!initialWorkout}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reiniciar
          </Button>
          <Button variant="secondary" onClick={handleExport} disabled={workout.length === 0}>
            <FileDown className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button variant="secondary" onClick={handlePrint} disabled={workout.length === 0}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
       </div>
      </TooltipProvider>
    );
  };
  
  return (
    <Card className="border-border/60 shadow-lg min-h-[500px]">
      <CardHeader>
        <CardTitle>Plan de Entrenamiento Interactivo</CardTitle>
        <CardDescription>Sigue tu progreso, haz ediciones y exporta tu rutina final.</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
