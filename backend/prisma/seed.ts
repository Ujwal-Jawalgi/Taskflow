import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client';
// import bcrypt from 'bcrypt'; // Would be used for real passwords

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database (DEV ONLY)...');

  // Cleanup existing data
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = 'dummyhash_not_for_prod';

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Developer',
      passwordHash,
      tasks: {
        create: [
          {
            title: 'Set up Next.js',
            description: 'Scaffold the frontend app',
            status: TaskStatus.DONE,
            priority: TaskPriority.HIGH,
          },
          {
            title: 'Create Prisma schema',
            description: 'Define User and Task models',
            status: TaskStatus.IN_PROGRESS,
            priority: TaskPriority.HIGH,
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Manager',
      passwordHash,
      tasks: {
        create: [
          {
            title: 'Review project plan',
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
          },
        ],
      },
    },
  });

  console.log('Seeding complete. Created users:');
  console.log(`- ${user1.email}`);
  console.log(`- ${user2.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
