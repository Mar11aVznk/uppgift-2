
import { Suspense } from "react";
import { db } from "@/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Окремий компонент для отримання тікетів
async function TicketsList() {
  const allTickets = await db.query.tickets.findMany({
    with: {
      user: true,
      category: true,
    },
  });

  return (
    <div className="grid gap-4">
      {allTickets.map((ticket) => (
        <Card key={ticket.id}>
          <CardHeader>
            <CardTitle>
              <Link
                href={`/tickets/${ticket.id}`}
                className="hover:underline"
              >
               {ticket.title}
              </Link>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p>
              Status:{" "}
             <Badge
               className={
                 ticket.status === "open"
                   ? "bg-orange-500"
                   : ticket.status === "in-progress"
                   ? "bg-blue-500"
                   : "bg-green-600"
               }
             >
               {ticket.status === "in-progress"
                 ? "In Progress"
                 : ticket.status}
             </Badge>
            </p>
            <p>Category: {ticket.category.name}</p>
            <p>Reported by: {ticket.user.name}</p>
            <p>
              Created: {ticket.createdAt.toLocaleDateString("sv-SE")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Головна частина сторінки Tickets
export default function TicketsPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Support Tickets
      </h1>

      <Suspense fallback={<p>Loading tickets...</p>}>
        <TicketsList />
      </Suspense>
    </main>
  );
}
