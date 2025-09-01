"use client";

import { useProfile } from "@/lib/hooks/useProfile";
import SportProfileForm from "@/components/forms/sport-profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  const { data: profileData, isLoading } = useProfile();

  if (isLoading) {
    return <div className="p-6">Chargement du profil...</div>;
  }

  const profile = profileData?.profile;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mon profil</h1>
        <p className="text-gray-600">
          {profile
            ? "Modifiez vos informations personnelles"
            : "Créez votre profil sportif"}
        </p>
      </div>

      <div className="max-w-2xl">
        <SportProfileForm profile={profile} />
      </div>

      {profile && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Informations actuelles</CardTitle>
            <CardDescription>Aperçu de votre profil sportif</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {profile.dateOfBirth && (
                <div>
                  <span className="font-medium">Date de naissance:</span>
                  <p className="text-gray-600">
                    {new Date(profile.dateOfBirth).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              )}
              {profile.gender && (
                <div>
                  <span className="font-medium">Genre:</span>
                  <p className="text-gray-600">
                    {profile.gender === "male"
                      ? "Homme"
                      : profile.gender === "female"
                        ? "Femme"
                        : "Autre"}
                  </p>
                </div>
              )}
              {profile.height && (
                <div>
                  <span className="font-medium">Taille:</span>
                  <p className="text-gray-600">{profile.height} cm</p>
                </div>
              )}
              {profile.weight && (
                <div>
                  <span className="font-medium">Poids:</span>
                  <p className="text-gray-600">{profile.weight} kg</p>
                </div>
              )}
              {profile.activityLevel && (
                <div>
                  <span className="font-medium">Niveau d'activité:</span>
                  <p className="text-gray-600">
                    {profile.activityLevel === "sedentary" && "Sédentaire"}
                    {profile.activityLevel === "light" && "Légèrement actif"}
                    {profile.activityLevel === "moderate" && "Modérément actif"}
                    {profile.activityLevel === "active" && "Actif"}
                    {profile.activityLevel === "very_active" && "Très actif"}
                  </p>
                </div>
              )}
            </div>

            {profile.primarySports && profile.primarySports.length > 0 && (
              <div>
                <span className="font-medium">Sports principaux:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.primarySports.map((sport, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.fitnessGoals && profile.fitnessGoals.length > 0 && (
              <div>
                <span className="font-medium">Objectifs fitness:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.fitnessGoals.map((goal, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
