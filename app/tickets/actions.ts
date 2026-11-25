"use server"

import { db } from "@/db"
import { tickets, ticketStatus } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function updateTicketStatus(formData: FormData ) {

    const rawTicketId = formData.get("ticketId")
    const rawStatus = formData.get("status") 

    console.log("FormData:", [...formData.entries()])
    console.log("rawTicketId:", rawTicketId)
    console.log("rawStatus:", rawStatus)

    //перевірка тікет айді
    if(
        typeof rawTicketId !== "string" ||
        !Number.isSafeInteger(Number(rawTicketId)) ||
        Number(rawTicketId) <= 0
    ) {
        throw new Error("Invalid ticket ID")
    }

    const ticketId = Number(rawTicketId)

    //перевірка статусу

    const allowedStatuses = ticketStatus.enumValues

    if (
        typeof rawStatus !== "string" ||
        !allowedStatuses.includes(
            rawStatus as (typeof allowedStatuses) [number]
        )
    ) {
        throw new Error("Invalid status")
    }

    const newStatus = rawStatus as (typeof allowedStatuses)[number]

    //Обновдення тікет в базі данних 

    const updatedTicket = await db
       .update(tickets)
       .set({ status: newStatus })
       .where(eq(tickets.id, ticketId))
       .returning({ id: tickets.id })

    if( updatedTicket.length === 0) {
        throw new Error ("Ticket not found")
    }

    //Обновити сторінку

    revalidatePath("/tickets")
    revalidatePath(`/tickets/${ticketId}`)
}