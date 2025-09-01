"use client";

import { useState } from "react";
import { useStats } from "@/lib/hooks/useStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, Calendar, TrendingUp, Zap } from "lucide-react";

export default function StatsPage() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const { data: statsData, isLoading } = useStats(period);

  if (isLoading) {
    return <div className="p-6">Chargement des statistiques...</div>;
  }

  const stats = statsData?.stats;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Statistiques</h1>
          <p className="text-gray-600">Analysez vos performances</p>
        </div>

        <Select
          value={period}
          onValueChange={(value: "week" | "month") => setPeriod(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activités totales
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalActivities || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {period === "week" ? "Cette semaine" : "Ce mois"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats?.totalDuration || 0) / 60)}h{" "}
              {(stats?.totalDuration || 0) % 60}min
            </div>
            <p className="text-xs text-muted-foreground">
              Durée d'entraînement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Distance totale
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.totalDistance || 0).toFixed(1)} km
            </div>
            <p className="text-xs text-muted-foreground">Distance parcourue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calories brûlées
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalCalories || 0}
            </div>
            <p className="text-xs text-muted-foreground">Énergie dépensée</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fréquence cardiaque moyenne</CardTitle>
            <CardDescription>Moyenne de vos séances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {stats?.avgHeartRate ? Math.round(stats.avgHeartRate) : "--"} bpm
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats?.avgHeartRate
                ? stats.avgHeartRate < 120
                  ? "Zone de récupération"
                  : stats.avgHeartRate < 150
                    ? "Zone aérobie"
                    : "Zone anaérobie"
                : "Données insuffisantes"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performances moyennes</CardTitle>
            <CardDescription>Moyennes par séance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Durée moyenne</span>
                <span className="text-sm">
                  {stats?.totalActivities
                    ? Math.round(
                        (stats.totalDuration || 0) / stats.totalActivities
                      )
                    : 0}{" "}
                  min
                </span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Distance moyenne</span>
                <span className="text-sm">
                  {stats?.totalActivities
                    ? (
                        (stats.totalDistance || 0) / stats.totalActivities
                      ).toFixed(1)
                    : 0}{" "}
                  km
                </span>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Calories moyennes</span>
                <span className="text-sm">
                  {stats?.totalActivities
                    ? Math.round(
                        (stats.totalCalories || 0) / stats.totalActivities
                      )
                    : 0}{" "}
                  cal
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {(!stats || stats.totalActivities === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Aucune donnée disponible
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez à enregistrer des activités pour voir vos statistiques
            </p>
            <Button asChild>
              <a href="/activities/new">Ajouter une activité</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
