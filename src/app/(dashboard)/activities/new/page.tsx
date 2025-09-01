"use client";

import { useRouter } from "next/navigation";
import ActivityForm from "@/components/forms/activity-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewActivityPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/activities");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/activities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nouvelle activité</h1>
          <p className="text-gray-600">
            Enregistrez votre séance d'entraînement
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <ActivityForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
