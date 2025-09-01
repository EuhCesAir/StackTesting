"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";

export default function GoalsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mes objectifs</h1>
          <p className="text-gray-600">
            Définissez et suivez vos objectifs fitness
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel objectif
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun objectif défini</h3>
          <p className="text-gray-600 mb-6">
            Définissez vos premiers objectifs pour rester motivé
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Créer un objectif
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
