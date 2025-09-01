"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateProfile, useUpdateProfile } from "@/lib/hooks/useProfile";
import type { SportProfile } from "@/lib/db/schema";

const profileSchema = z.object({
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  height: z.number().min(100).max(250).optional(),
  weight: z.number().min(30).max(300).optional(),
  activityLevel: z
    .enum(["sedentary", "light", "moderate", "active", "very_active"])
    .optional(),
  primarySports: z.array(z.string()),
  fitnessGoals: z.array(z.string()),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface SportProfileFormProps {
  profile?: SportProfile | null;
  onSuccess?: () => void;
}

export default function SportProfileForm({
  profile,
  onSuccess,
}: SportProfileFormProps) {
  const [sportInput, setSportInput] = useState("");
  const [goalInput, setGoalInput] = useState("");

  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      dateOfBirth: profile?.dateOfBirth?.toISOString().split("T")[0] || "",
      gender: (profile?.gender as "male" | "female" | "other") || undefined,
      height: profile?.height || undefined,
      weight: profile?.weight ? Number(profile.weight) : undefined,
      activityLevel:
        (profile?.activityLevel as
          | "sedentary"
          | "light"
          | "moderate"
          | "active"
          | "very_active") || undefined,
      primarySports: profile?.primarySports || [],
      fitnessGoals: profile?.fitnessGoals || [],
    },
  });

  const primarySports = watch("primarySports");
  const fitnessGoals = watch("fitnessGoals");

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const submitData = {
        ...data,
        height: data.height ? Number(data.height) : undefined,
        weight: data.weight ? Number(data.weight) : undefined,
      };

      if (profile) {
        await updateProfile.mutateAsync(submitData);
      } else {
        await createProfile.mutateAsync(submitData);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const addSport = () => {
    if (sportInput.trim()) {
      setValue("primarySports", [...primarySports, sportInput.trim()]);
      setSportInput("");
    }
  };

  const removeSport = (index: number) => {
    setValue(
      "primarySports",
      primarySports.filter((_, i) => i !== index)
    );
  };

  const addGoal = () => {
    if (goalInput.trim()) {
      setValue("fitnessGoals", [...fitnessGoals, goalInput.trim()]);
      setGoalInput("");
    }
  };

  const removeGoal = (index: number) => {
    setValue(
      "fitnessGoals",
      fitnessGoals.filter((_, i) => i !== index)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {profile ? "Modifier" : "Créer"} votre profil sportif
        </CardTitle>
        <CardDescription>
          Renseignez vos informations pour personnaliser votre expérience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date de naissance</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-600">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Genre</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Homme</SelectItem>
                      <SelectItem value="female">Femme</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Taille (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                {...register("height", { valueAsNumber: true })}
              />
              {errors.height && (
                <p className="text-sm text-red-600">{errors.height.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70"
                {...register("weight", { valueAsNumber: true })}
              />
              {errors.weight && (
                <p className="text-sm text-red-600">{errors.weight.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityLevel">Niveau d'activité</Label>
            <Controller
              name="activityLevel"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner votre niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sédentaire</SelectItem>
                    <SelectItem value="light">Légèrement actif</SelectItem>
                    <SelectItem value="moderate">Modérément actif</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="very_active">Très actif</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Sports principaux</Label>
            <div className="flex gap-2">
              <Input
                value={sportInput}
                onChange={(e) => setSportInput(e.target.value)}
                placeholder="Ajouter un sport"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSport())
                }
              />
              <Button type="button" onClick={addSport}>
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {primarySports.map((sport, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {sport}
                  <button
                    type="button"
                    onClick={() => removeSport(index)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Objectifs fitness</Label>
            <div className="flex gap-2">
              <Input
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Ajouter un objectif"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addGoal())
                }
              />
              <Button type="button" onClick={addGoal}>
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {fitnessGoals.map((goal, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {goal}
                  <button
                    type="button"
                    onClick={() => removeGoal(index)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting
              ? "Enregistrement..."
              : profile
                ? "Mettre à jour"
                : "Créer le profil"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
