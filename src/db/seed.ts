import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await hash("ktcbtest", 12);
  const user = await prisma.user.create({
    data: {
      username: "Nguyen Huu Tai",
      email: "tainguyen29702@gmail.com",
      password: password,
      member: {
        connect: { id: 1 },
      },
      role: {
        connect: { name: "ADMIN" }, 
      }

    }
  });
  console.log({ user });

  const member = await prisma.member.create({
    data: {
      fullName: "KTCB Admin",
      email: "tainguyen29702@gmail.com",
      phoneNumber: "0987654321",
      birthday: new Date("2000-01-01"),
      address: "Hà Nội",
      bank: "Vietcombank",
      bankAccount: "123456789",
      workPlace: "Hà Nội",
      avatar: "default-avatar.png", // Example avatar
      position: {
        connect: { id: 1 }, // Connect to an existing position by ID
      },
      team: {
        connect: { id: 1 }, // Connect to an existing team by ID
      },
    },
  });

  const permissions = await prisma.permission.createMany({
    data: [
      // Cá nhân
      { name: 'EDIT_PROFILE' },

      // Tài liệu
      { name: 'VIEW_INTERNAL_DOCS' },

      // Thành viên
      { name: 'VIEW_MEMBERS' },
      { name: 'MANAGE_MEMBERS' },

      // Tài chính
      { name: 'APPROVE_PAYMENT' },

      // Đơn tuyển
      { name: 'VIEW_APPLICATIONS' },
      { name: 'EDIT_APPLICATIONS' },

      // Truyền thông
      { name: 'SHARE_POSTS' },

      // Sự kiện
      { name: 'MANAGE_EVENT' },

      // Bài viết
      { name: 'MANAGE_POST' }
    ],
    skipDuplicates: true
  });


  // 3. Tạo các Role và gán Permission
  // Lấy tất cả permissions để map
  const allPermissions = await prisma.permission.findMany();
  const getPermissionIds = (codes: string[]) =>
    allPermissions.filter(p => codes.includes(p.name)).map(p => ({ id: p.id }));

  // Tạo các role với permissions tương ứng
  const roles = [
    {
      name: 'MEMBER',
      permissions: getPermissionIds(['EDIT_PROFILE', 'VIEW_INTERNAL_DOCS', 'VIEW_MEMBERS', 'MANAGE_EVENT', 'MANAGE_POST'])
    },
    {
      name: 'TEAM_LEADER',
      permissions: getPermissionIds([
        'EDIT_PROFILE', 'VIEW_INTERNAL_DOCS', 'VIEW_MEMBERS',
        'VIEW_APPLICATIONS'
      ])
    },
    {
      name: 'MEDIA_TEAM_LEADER',
      permissions: getPermissionIds([
        'EDIT_PROFILE', 'VIEW_INTERNAL_DOCS', 'VIEW_MEMBERS',
        'VIEW_APPLICATIONS', 'SHARE_POSTS', 'MANAGE_POST'
      ])
    },
    {
      name: 'FINANCE_TEAM_LEADER',
      permissions: getPermissionIds([
        'EDIT_PROFILE', 'VIEW_INTERNAL_DOCS', 'VIEW_MEMBERS',
        'VIEW_APPLICATIONS', 'EDIT_APPLICATIONS', 'APPROVE_PAYMENT'
      ])
    },
    {
      name: 'TREASURER',
      permissions: getPermissionIds([
        'EDIT_PROFILE', 'VIEW_INTERNAL_DOCS', 'VIEW_MEMBERS',
        'APPROVE_PAYMENT'
      ])
    },
    {
      name: 'ADMIN',
      permissions: getPermissionIds([
        'EDIT_PROFILE', 'VIEW_INTERNAL_DOCS', 'VIEW_MEMBERS',
        'APPROVE_PAYMENT', 'VIEW_APPLICATIONS', 'EDIT_APPLICATIONS', 
        'MANAGE_MEMBERS', 'SHARE_POSTS', 'MANAGE_EVENT', 'MANAGE_POST'
      ])
    }
  ];

  for (const role of roles) {
    await prisma.role.create({
      data: {
        name: role.name,
        permissions: {
          connect: role.permissions
        }
      }
    });
  }

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
  // await prisma.position.upsert({
  //   where: { id: 3 },
  //   update: {},
  //   create: {
  //     name: 'Thư ký',
  //   },
  // });
  // await prisma.position.upsert({
  //   where: { id: 4 },
  //   update: {},
  //   create: {
  //     name: 'Chủ tịch',
  //   },
  // });

  /// seed teams
  await prisma.team.upsert({
    where: { id: 1 },
    update: { name: 'Truyền thông' },
    create: {
      name: 'Truyền thông',
    },
  });
  await prisma.team.upsert({
    where: { id: 2 },
    update: { name: 'Kiến trúc sư tình nguyện' },
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
