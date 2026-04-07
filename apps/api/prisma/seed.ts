import { GameName, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.game.upsert({
    where: { name: GameName.POKER },
    update: {},
    create: { name: GameName.POKER },
  });

  await prisma.game.upsert({
    where: { name: GameName.BLACKJACK },
    update: {},
    create: { name: GameName.BLACKJACK },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
