
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

  // Розділяємо тікети за статусом
  const openTickets = allTickets.filter(
    (ticket) => ticket.status === "open"
  );

  const inProgressTickets = allTickets.filter(
    (ticket) => ticket.status === "in-progress"
  );

  const resolvedTickets = allTickets.filter(
    (ticket) => ticket.status === "resolved"
  );

  // Масив із трьома колонками
  const columns = [
    {
      title: "Open",
      tickets: openTickets,
      color: "bg-orange-500",
    },
    {
      title: "In Progress",
      tickets: inProgressTickets,
      color: "bg-blue-500",
    },
    {
      title: "Resolved",
      tickets: resolvedTickets,
      color: "bg-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => (
        <div
          key={column.title}
          className="rounded-lg bg-gray-100 p-3"
        >
          {/* Назва колонки */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-lg">
              {column.title}
            </h2>

            <Badge>{column.tickets.length}</Badge>
          </div>

        
          {/* Картки */}
          <div className="space-y-3">
            {column.tickets.map((ticket) => (
             <Card key={ticket.id} className="shadow-sm">
              <CardContent className="p-3">
               <div className="flex items-center justify-between gap-2">

                 {/* Ліва частина */}
                 <div className="min-w-0">
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="font-semibold text-sm hover:underline"
                    >
                      {ticket.title}
                    </Link>

                    <p className="text-xs text-gray-500 mt-1">
                     {ticket.category.name} · {ticket.user.name}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {ticket.createdAt.toLocaleDateString("sv-SE")}
                    </p>
                  </div>

                    {/* Права частина */}
                    <Badge className={`${column.color} shrink-0`}>
                      {column.title}
                    </Badge>

                 </div>
               </CardContent>
             </Card>
           ))}
         </div>

        </div>
      ))}
    </div>
  );
}


// Головна частина сторінки Tickets
export default function TicketsPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Support Tickets
        </h1>

        <Link
          href="/tickets/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
           Create new ticket
        </Link>
      </div>

      <Suspense fallback={<p>Loading tickets...</p>}>
        <TicketsList />
      </Suspense>
    </main>
  );
}
