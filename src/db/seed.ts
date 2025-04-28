import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // seed users
  const password = await hash("ktcbtest", 12);
  const user = await prisma.user.upsert({
    where: { email: "ktcb@gmail.com" },
    update: {},
    create: {
      email: "ktcb@gmail.com",
      username: "KTCB Admin",
      password,
    },
  });
  console.log({ user });
  // seed positions
  await prisma.position.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Tình nguyện viên',
    },
  });
  await prisma.position.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Thành viên ban tổ chức',
    },
  });
  await prisma.position.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Thư ký',
    },
  });
  await prisma.position.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Chủ tịch',
    },
  });

  /// seed teams
  await prisma.team.upsert({
    where: { id: 1 },
    update: {name: 'Truyền thông'},
    create: {
      name: 'Truyền thông',
    },
  });
  await prisma.team.upsert({
    where: { id: 2 },
    update: { name:'Kiến trúc sư tình nguyện' },
    create: {
      name: 'Kiến trúc sư tình nguyện',
    },
  });
  await prisma.team.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Cùng bé trải nghiệm',
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
