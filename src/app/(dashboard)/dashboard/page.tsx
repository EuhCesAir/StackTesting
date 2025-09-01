"use client";

import { getSession } from "@/lib/auth/client";
import { useProfile } from "@/lib/hooks/useProfile";
import { useStats } from "@/lib/hooks/useStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, Target, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: statsData } = useStats("week");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await getSession();
        setSession(sessionData);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setSessionLoading(false);
      }
    };

    checkSession();
  }, []);

  if (sessionLoading || profileLoading) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!session) {
    return <div className="p-8">Non authentifié</div>;
  }

  const stats = statsData?.stats;
  const profile = profileData?.profile;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bonjour, {session.user.name}</h1>
          <p className="text-gray-600">Voici un aperçu de votre semaine</p>
        </div>
        {!profile && (
          <Link href="/profile">
            <Button>Compléter le profil</Button>
          </Link>
        )}
      </div>

      {!profile ? (
        <Card>
          <CardHeader>
            <CardTitle>Bienvenue sur SportTracker</CardTitle>
            <CardDescription>
              Commencez par créer votre profil sportif pour personnaliser votre
              expérience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/profile">
              <Button>Créer mon profil</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activités</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalActivities || 0}
                </div>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Temps total
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((stats?.totalDuration || 0) / 60)}h
                </div>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Distance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalDistance?.toFixed(1) || 0} km
                </div>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calories</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalCalories || 0}
                </div>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activités récentes</CardTitle>
                <CardDescription>
                  Vos dernières séances d'entraînement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Aucune activité récente</p>
                  <Link href="/activities/new">
                    <Button>Enregistrer une activité</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Objectifs en cours</CardTitle>
                <CardDescription>Vos objectifs fitness actuels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Aucun objectif défini</p>
                  <Link href="/goals">
                    <Button variant="outline">Définir des objectifs</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
