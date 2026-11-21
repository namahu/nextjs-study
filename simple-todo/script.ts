import { prisma } from "@/lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@test.com",
      name: "test user",
      tasks: {
        create: {
          title: "sample task",
          description: "sample description",
        },
      },
    },
    include: {
      tasks: true,
    },
  });

  console.log("User: ", user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log("Error: ", e);
    await prisma.$disconnect();
    process.exit(1);
  });
