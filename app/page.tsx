
import { db } from "@/db";
import { users } from "@/db/schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const allUsers = await db.select().from(users);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            IT Support System
          </h1>

          <p className="mt-4 text-gray-600">
            Ett enkelt system för att registrera och hantera interna
            supportärenden.
          </p>
        </div>

        <h2 className="mb-4 text-2xl font-semibold">
          Användare
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {allUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>
                  Användare i systemet
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="mb-4">{user.email}</p>
                <Button>Visa supportärenden</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
