import { db } from "@/db"
import { tickets } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

async function TicketContent({ params }: {params: Promise<{id: string}>}) {

    const { id } = await params

    const ticketId = Number(id)

    if(!Number.isInteger(ticketId) || ticketId<= 0) {
      notFound()
    }

    const ticket = await db.query.tickets.findFirst({
        where: eq(tickets.id, ticketId),
        with: {
            user: true,
            category: true
        }
    })

    if(!ticket) {
        notFound()
    }

    return(
      <div className="rounded-lg border p-6 space-y-5">

        <h1 className="text-2xl font-bold">
          {ticket.title}
        </h1>

        <div>
          <h2 className="font-semibold">Beskrivning</h2>
          <p>{ticket.description}</p>
        </div>

        <div>
          <h2 className="font-semibold">Status</h2>
          <p>{ticket.status}</p>
        </div>

        <div>
          <h2 className="font-semibold">Kategori</h2>
          <p>{ticket.category.name}</p>
        </div>

        <div>
          <h2 className="font-semibold">Rapporterad av</h2>
          <p>{ticket.user.name}</p>
          <p>{ticket.user.email}</p>
        </div>

        <div>
          <h2 className="font-semibold">Skapad</h2>
          <p>
            {ticket.createdAt.toLocaleDateString("sv-SE")}
          </p>
        </div>

      </div>
    )
}

export default async function TicketPage({
     params, 
     }:{ params: Promise<{id: string}> 
   }) {

    return  (
    <main className="mx-auto max-w-2xl p-8 space-y-6">

      <Link
        href="/tickets"
        className="text-blue-600 hover:underline"
      >
        ← Tillbaka till ärendelistan
      </Link>
      <Suspense fallback={<p>Loading ticket...</p>}>
         <TicketContent params={params}/>
      </Suspense>

    </main>
  );
    
   }
