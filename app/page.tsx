
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">IT Support System</h1>

          <p className="mt-4 text-gray-600">
            Ett enkelt system för att registrera och hantera interna
            supportärenden.
          </p>
        </div>

        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Supportärenden</CardTitle>

            <CardDescription>
              Här kan företagets interna IT-problem registreras och hanteras.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button>Visa supportärenden</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}