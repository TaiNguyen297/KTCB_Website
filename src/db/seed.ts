import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // seed users
  const password = await hash("ktcbtest", 12);
  const user = await prisma.user.create({
    data: {
      username: "Nguyen Van A",
      email: "tainguyen29702@gmail.com",
      password: password,
      member: {
        connect: { id: 1 },
      },
      role: {
        connect: { name: "CHAIRMAN" }, 
      }

    }
  });
  // console.log({ user });

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
      { name: 'CREATE_PAYMENT_REQUEST' },
      { name: 'PROCESS_PAYMENT' },
      { name: 'APPROVE_PAYMENT' },

      // Đơn tuyến
      { name: 'VIEW_APPLICATIONS' },
      { name: 'EDIT_APPLICATIONS' },

      // Truyền thông
      { name: 'SHARE_POSTS' }
    ],
    skipDuplicates: true
  });

  // const event = await prisma.volunteerEvents.create({ 
  //   data: {
  //     title: "KTCB Volunteer Event",
  //     description: "A volunteer event organized by KTCB.",
  //     startDate: new Date("2024-05-01T10:00:00Z"),
  //     endDate: new Date("2024-05-01T18:00:00Z"),
  //     location: "Hanoi, Vietnam",
  //     status: "UPCOMING",
  //     mapLink: "https://maps.google.com",
  //     image: "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482552zrD/anh-mo-ta.png",

  //   },
  // });

  // 3. Tạo các Role và gán Permission
  // Lấy tất cả permissions để map
  const allPermissions = await prisma.permission.findMany();
  const getPermissionIds = (codes: string[]) =>
    allPermissions.filter(p => codes.includes(p.name)).map(p => ({ id: p.id }));

  // Tạo các role với permissions tương ứng
  const roles = [
    {
      name: 'MEMBER',
      permissions: getPermissionIds(['EDIT_PROFILE', 'VIEW_INTERNAL_DOCS', 'VIEW_MEMBERS'])
    },
    {
      name: 'TEAM_LEADER',
      permissions: getPermissionIds([
        'EDIT_PROFILE', 'VIEW_INTERNAL_DOCS', 'VIEW_MEMBERS',
        'CREATE_PAYMENT_REQUEST', 'VIEW_APPLICATIONS'
      ])
    },
    {
      name: 'MEDIA_TEAM_LEADER',
      permissions: getPermissionIds([
        'EDIT_PROFILE', 'VIEW_INTERNAL_DOCS', 'VIEW_MEMBERS',
        'CREATE_PAYMENT_REQUEST', 'VIEW_APPLICATIONS', 'SHARE_POSTS'
      ])
    },
    {
      name: 'FINANCE_TEAM_LEADER',
      permissions: getPermissionIds([
        'EDIT_PROFILE', 'VIEW_INTERNAL_DOCS', 'VIEW_MEMBERS',
        'CREATE_PAYMENT_REQUEST', 'VIEW_APPLICATIONS', 'EDIT_APPLICATIONS'
      ])
    },
    {
      name: 'TREASURER',
      permissions: getPermissionIds([
        'EDIT_PROFILE', 'VIEW_INTERNAL_DOCS', 'VIEW_MEMBERS',
        'CREATE_PAYMENT_REQUEST', 'PROCESS_PAYMENT'
      ])
    },
    {
      name: 'CHAIRMAN',
      permissions: getPermissionIds([
        'EDIT_PROFILE', 'VIEW_INTERNAL_DOCS', 'VIEW_MEMBERS',
        'CREATE_PAYMENT_REQUEST', 'PROCESS_PAYMENT', 'APPROVE_PAYMENT',
        'VIEW_APPLICATIONS', 'EDIT_APPLICATIONS', 'MANAGE_MEMBERS'
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
