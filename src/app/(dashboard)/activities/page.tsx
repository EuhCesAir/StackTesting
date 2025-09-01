"use client";

import { useState } from "react";
import Link from "next/link";
import { useActivities } from "@/lib/hooks/useActivities";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Calendar, Clock, MapPin, Zap } from "lucide-react";
import { formatDate, formatDuration, formatNumber } from "@/lib/utils";

export default function ActivitiesPage() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useActivities();

  if (isLoading) {
    return <div className="p-6">Chargement des activités...</div>;
  }

  const activities = data?.pages.flatMap((page) => page.activities) ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mes activités</h1>
          <p className="text-gray-600">
            Historique de vos séances d'entraînement
          </p>
        </div>
        <Link href="/activities/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle activité
          </Button>
        </Link>
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mb-4">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Aucune activité enregistrée
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez à suivre vos entraînements en ajoutant votre première
              activité
            </p>
            <Link href="/activities/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une activité
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {activity.title}
                      </CardTitle>
                      <CardDescription>
                        {formatDate(activity.startTime)}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(activity.startTime).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {activity.description && (
                    <p className="text-gray-600 mb-4">{activity.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {activity.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{formatDuration(activity.duration)}</span>
                      </div>
                    )}

                    {activity.distance && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>
                          {formatNumber(Number(activity.distance))} km
                        </span>
                      </div>
                    )}

                    {activity.caloriesBurned && (
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-gray-400" />
                        <span>{activity.caloriesBurned} cal</span>
                      </div>
                    )}

                    {activity.heartRateAvg && (
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">♥</span>
                        <span>{activity.heartRateAvg} bpm</span>
                      </div>
                    )}
                  </div>

                  {activity.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">{activity.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {hasNextPage && (
            <div className="text-center">
              <Button variant="outline" onClick={() => fetchNextPage()}>
                Charger plus d'activités
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
