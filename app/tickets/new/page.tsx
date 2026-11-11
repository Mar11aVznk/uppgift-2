
import { Suspense } from "react";
import { db } from "@/db";
import { tickets } from "@/db/schema";
import { redirect } from "next/navigation";


// Функція для створення нового звернення
async function createTicket(formData: FormData) {
  "use server";

  const title = formData.get("title");
  const description = formData.get("description");
  const userId = formData.get("userId");
  const categoryId = formData.get("categoryId");

  // Перевіряємо, чи всі поля заповнені
  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    !description.trim() ||
    !userId ||
    !categoryId
  ) {
    return;
  }

  // Перетворюємо ID на числа
  const selectedUserId = Number(userId);
  const selectedCategoryId = Number(categoryId);

  if (
    !Number.isInteger(selectedUserId) ||
    !Number.isInteger(selectedCategoryId)
  ) {
    return;
  }

  const selectedUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, selectedUserId),
  });

const selectedCategory = await db.query.categories.findFirst({
  where: (categories, { eq }) =>
    eq(categories.id, selectedCategoryId),
});

if (!selectedUser || !selectedCategory) {
  return;
}

  // Зберігаємо нове звернення в базі даних
  await db.insert(tickets).values({
    title: title.trim(),
    description: description.trim(),
    userId: selectedUserId,
    categoryId: selectedCategoryId,
  });

  // Повертаємося до списку звернень
  redirect("/tickets");
}


// Окремий компонент для отримання даних і форми
async function NewTicketForm() {
  // Отримуємо користувачів із бази даних
  const allUsers = await db.query.users.findMany();

  // Отримуємо категорії з бази даних
  const allCategories = await db.query.categories.findMany();

  return (
    <form action={createTicket} className="grid gap-4">

      {/* Title */}
      <div>
        <label className="mb-2 block">Title</label>
        <input
          type="text"
          name="title"
          required
          className="w-full rounded-md border p-2"
          placeholder="Enter title"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block">Description</label>
        <textarea
          name="description"
          required
          className="w-full rounded-md border p-2"
          placeholder="Describe the problem"
        />
      </div>

      {/* User dropdown */}
      <div>
        <label className="mb-2 block">Reported by</label>

        <select
          name="userId"
          required
          className="w-full rounded-md border p-2"
          defaultValue=""
        >
          <option value="" disabled>
            Select user
          </option>

          {allUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category dropdown */}
      <div>
        <label className="mb-2 block">Category</label>

        <select
          name="categoryId"
          required
          className="w-full rounded-md border p-2"
          defaultValue=""
        >
          <option value="" disabled>
            Select category
          </option>

          {allCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
             Create ticket
        </button>
    </form>
    
  );
}

// Головна сторінка
export default function NewTicketPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Create new ticket
      </h1>

      <Suspense fallback={<p>Loading form...</p>}>
        <NewTicketForm />
      </Suspense>
    </main>
  );
}
