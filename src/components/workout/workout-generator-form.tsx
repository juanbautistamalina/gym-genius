'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateWorkout } from '@/app/actions';
import type { WorkoutDay } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const formSchema = z.object({
  fitnessGoal: z.enum(['strength', 'hypertrophy', 'endurance'], {
    required_error: 'Por favor, selecciona un objetivo de fitness.',
  }),
  equipmentType: z.enum(['gym', 'manual'], { 
    required_error: 'Por favor, selecciona un tipo de equipo.' 
  }),
  availableEquipment: z.string().optional(),
  workoutHistory: z.string().optional(),
}).refine(data => {
  if (data.equipmentType === 'manual') {
    return data.availableEquipment && data.availableEquipment.length >= 3;
  }
  return true;
}, {
  message: 'Por favor, enumera al menos una pieza de equipo.',
  path: ['availableEquipment'],
});


type WorkoutGeneratorFormProps = {
  onWorkoutGenerated: (workout: WorkoutDay[] | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  onError: (error: string | null) => void;
};

export function WorkoutGeneratorForm({ onWorkoutGenerated, setIsLoading, onError }: WorkoutGeneratorFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fitnessGoal: 'hypertrophy',
      equipmentType: 'gym',
      availableEquipment: '',
      workoutHistory: '',
    },
  });

  const equipmentType = form.watch('equipmentType');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onError(null);
    onWorkoutGenerated(null);

    const submissionValues = {
      ...values,
      availableEquipment: values.equipmentType === 'gym' 
        ? 'Acceso a un gimnasio comercial completo con todo el equipo estándar (barras, mancuernas, máquinas, cables, etc.)' 
        : values.availableEquipment!,
    };

    const { data, error } = await handleGenerateWorkout(submissionValues);

    if (error) {
      onError(error);
      toast({
        variant: 'destructive',
        title: 'Falló la Generación',
        description: error,
      });
    } else {
      onWorkoutGenerated(data);
      toast({
        title: '¡Rutina Generada!',
        description: "Tu rutina personalizada está lista.",
      });
    }

    setIsLoading(false);
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Card className="border-border/60 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Personaliza Tu Plan</CardTitle>
            <CardDescription>Dile a la IA lo que necesitas. Cuantos más detalles, mejor será tu plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="fitnessGoal"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Objetivo Principal de Fitness</FormLabel>
                   <TooltipProvider>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="strength" />
                          </FormControl>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <FormLabel className="font-normal cursor-pointer">
                                Fuerza (Powerlifting)
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="start">
                              <p>Para quienes buscan levantar más peso y<br />aumentar su fuerza máxima.</p>
                            </TooltipContent>
                          </Tooltip>
                        </FormItem>

                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="hypertrophy" />
                          </FormControl>
                          <Tooltip>
                            <TooltipTrigger asChild>
                               <FormLabel className="font-normal cursor-pointer">
                                Hipertrofia (Culturismo)
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="start">
                               <p>Ideal para quienes quieren aumentar el<br />tamaño muscular y la definición.</p>
                            </TooltipContent>
                          </Tooltip>
                        </FormItem>

                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="endurance" />
                          </FormControl>
                           <Tooltip>
                            <TooltipTrigger asChild>
                              <FormLabel className="font-normal cursor-pointer">
                                Resistencia (Funcional)
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="start">
                              <p>Enfocado en mejorar la capacidad cardiovascular<br />y la resistencia muscular.</p>
                            </TooltipContent>
                          </Tooltip>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                   </TooltipProvider>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="equipmentType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Equipo Disponible</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="gym" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Gimnasio
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="manual" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Especificar manualmente
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {equipmentType === 'manual' && (
              <FormField
                control={form.control}
                name="availableEquipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lista de tu Equipo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Mancuernas, Barra, Banco, Barra de dominadas" {...field} />
                    </FormControl>
                    <FormDescription>Separa los elementos con una coma.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="workoutHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historial de Entrenamiento (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Principiante, 3 años de experiencia, recuperándome de una lesión en el hombro."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>Tu nivel de experiencia ayuda a adaptar la intensidad.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                'Generar Rutina'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
