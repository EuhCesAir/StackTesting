"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateActivity } from "@/lib/hooks/useActivities";

const activitySchema = z.object({
  activityTypeId: z.string().min(1, "Type d'activité requis"),
  title: z.string().min(1, "Titre requis").max(200),
  description: z.string().optional(),
  startTime: z.string().min(1, "Heure de début requise"),
  endTime: z.string().optional(),
  duration: z.string().optional(),
  distance: z.string().optional(),
  caloriesBurned: z.string().optional(),
  heartRateAvg: z.string().optional(),
  heartRateMax: z.string().optional(),
  notes: z.string().optional(),
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface ActivityFormProps {
  onSuccess?: () => void;
}

export default function ActivityForm({ onSuccess }: ActivityFormProps) {
  const createActivity = useCreateActivity();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
  });

  const onSubmit = async (data: ActivityFormData) => {
    try {
      // Convertir les chaînes en nombres quand nécessaire
      const transformedData = {
        ...data,
        duration: data.duration ? Number(data.duration) : undefined,
        distance: data.distance ? Number(data.distance) : undefined,
        caloriesBurned: data.caloriesBurned
          ? Number(data.caloriesBurned)
          : undefined,
        heartRateAvg: data.heartRateAvg ? Number(data.heartRateAvg) : undefined,
        heartRateMax: data.heartRateMax ? Number(data.heartRateMax) : undefined,
      };

      await createActivity.mutateAsync(transformedData);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle activité</CardTitle>
        <CardDescription>
          Enregistrez votre séance d'entraînement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activityTypeId">Type d'activité</Label>
            <select
              id="activityTypeId"
              {...register("activityTypeId")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Sélectionner un type</option>
              <option value="running">Course à pied</option>
              <option value="cycling">Cyclisme</option>
              <option value="swimming">Natation</option>
              <option value="fitness">Fitness</option>
              <option value="other">Autre</option>
            </select>
            {errors.activityTypeId && (
              <p className="text-sm text-red-600">
                {errors.activityTypeId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'activité</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Course matinale"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Détails sur votre séance..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Heure de début</Label>
              <Input
                id="startTime"
                type="datetime-local"
                {...register("startTime")}
              />
              {errors.startTime && (
                <p className="text-sm text-red-600">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin</Label>
              <Input
                id="endTime"
                type="datetime-local"
                {...register("endTime")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input
                id="duration"
                type="number"
                {...register("duration")}
                placeholder="30"
              />
              {errors.duration && (
                <p className="text-sm text-red-600">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                {...register("distance")}
                placeholder="5.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caloriesBurned">Calories brûlées</Label>
              <Input
                id="caloriesBurned"
                type="number"
                {...register("caloriesBurned")}
                placeholder="300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heartRateAvg">FC moyenne</Label>
              <Input
                id="heartRateAvg"
                type="number"
                {...register("heartRateAvg")}
                placeholder="140"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Ressenti, conditions, remarques..."
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Enregistrement..." : "Enregistrer l'activité"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
