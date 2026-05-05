import { loadEnvFile } from 'node:process';

import { PrismaClient } from '@prisma/client';

try {
  loadEnvFile('.env');
} catch (error) {
  if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
    throw error;
  }
}

const prisma = new PrismaClient();

function parseEmailArg() {
  const emailFlagIndex = process.argv.findIndex((arg) => arg === '--email');
  const emailArg = emailFlagIndex >= 0 ? process.argv[emailFlagIndex + 1] : process.argv[2];
  const email = emailArg?.trim().toLowerCase();

  if (!email) {
    throw new Error(
      'Usage: npm run admin:promote --workspace @playsharp/api -- --email user@example.com',
    );
  }

  return email;
}

async function main() {
  const email = parseEmailArg();
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!existingUser) {
    throw new Error(`No user found for ${email}. Register the account first, then promote it.`);
  }

  if (existingUser.role === 'ADMIN') {
    console.log(`User ${email} is already an admin.`);
    return;
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { role: 'ADMIN' },
  });

  console.log(`Promoted ${email} to admin.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
