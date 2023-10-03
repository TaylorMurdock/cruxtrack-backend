// Import the PrismaClient from the @prisma/client package
import { PrismaClient } from "@prisma/client";

// Create a new instance of the PrismaClient
const prisma = new PrismaClient();

// Define an async function called 'main'
async function main() {
  // Use Prisma to retrieve all records from the 'user' table
  const users = await prisma.user.findMany();

  // Log the retrieved users to the console
  console.log(users);
}

// Call the 'main' function to execute the database query
main()
  .then(async () => {
    // Disconnect the Prisma client to release the database connection
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // Handle errors: Log the error message, disconnect the Prisma client, and exit with an error code
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
