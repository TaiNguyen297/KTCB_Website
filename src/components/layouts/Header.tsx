import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Stack } from "@mui/material";
import Drawer from "@mui/material/Drawer";

import menuData from "../../utils/data/json/header.json";
import logoNoBackground from "../../../public/ktcb_logo_no_background.png";
import MenuSection from "./Menu";
import VerticalMenu from "./Menu/SideMenu/SideMenuSection";
import { AccountMenu } from "../features/account-menu";

export type MenuType = typeof menuData;

const Header = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { data: session } = useSession();

  console.log("Session in Header:", session);

  const handleToggleSideMenu = () => {
    setOpenSideMenu((prev) => !prev);
  };

  // Mapping roleId sang permissions (theo seed)
  const rolePermissionsMap: Record<number, string[]> = {
    1: [ // MEMBER
      "EDIT_PROFILE", "VIEW_INTERNAL_DOCS", "VIEW_MEMBERS"
    ],
    2: [ // TEAM_LEADER
      "EDIT_PROFILE", "VIEW_INTERNAL_DOCS", "VIEW_MEMBERS", "VIEW_APPLICATIONS"
    ],
    3: [ // MEDIA_TEAM_LEADER
      "EDIT_PROFILE", "VIEW_INTERNAL_DOCS", "VIEW_MEMBERS", "VIEW_APPLICATIONS", "SHARE_POSTS", "MANAGE_POST"
    ],
    4: [ // FINANCE_TEAM_LEADER
      "EDIT_PROFILE", "VIEW_INTERNAL_DOCS", "VIEW_MEMBERS", "VIEW_APPLICATIONS", "EDIT_APPLICATIONS", "APPROVE_PAYMENT"
    ],
    5: [ // TREASURER
      "EDIT_PROFILE", "VIEW_INTERNAL_DOCS", "VIEW_MEMBERS", "APPROVE_PAYMENT"
    ],
    6: [ // ADMIN
      "EDIT_PROFILE", "VIEW_INTERNAL_DOCS", "VIEW_MEMBERS", "APPROVE_PAYMENT", "VIEW_APPLICATIONS", "EDIT_APPLICATIONS", "MANAGE_MEMBERS", "SHARE_POSTS", "MANAGE_EVENT", "MANAGE_POST"
    ]
  };

  const getUserPermissions = (): string[] => {
    // Lấy roleId từ session, ưu tiên ép kiểu về number
    const roleId = session?.user && (session.user as any).roleId;
    if (!roleId) return [];
    return rolePermissionsMap[roleId];
  };

  // Hàm kiểm tra user có quyền với menu
  const hasPermission = (menu: any, userPermissions: string[]): boolean => {
    if (!menu.permissions) return true; // menu không yêu cầu quyền
    return menu.permissions.some((p: string) => userPermissions.includes(p));
  };

  // Hàm lọc subMenus theo quyền
  const filterMenuWithSubMenus = (menu: any, userPermissions: string[]) => {
    if (!menu.subMenus) return menu;
    
    // Lọc subMenus theo quyền
    const filteredSubMenus = menu.subMenus.filter((subMenu: any) => 
      hasPermission(subMenu, userPermissions)
    );
    
    return {
      ...menu,
      subMenus: filteredSubMenus
    };
  };

  const userPermissions = getUserPermissions();

  return (
    <Box
      sx={{
        boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 15px",
        px: {
          xs: 1,
          md: 2,
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        my={0}
        sx={{
          py: 2,
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <IconButton
          sx={{ display: ["block", "block", "block", "none"] }}
          onClick={handleToggleSideMenu}
        >
          <MenuIcon sx={{ fontSize: 30 }} />
        </IconButton>
        <Link href="/" className="flex items-center">
          <Image
            src={logoNoBackground.src}
            alt="logoNoBackground"
            width={70}
            height={70}
          />
        </Link>
        <Box display={["none", "none", "none", "block"]}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={7}
          >
            {menuData
              .filter((menu) => (session || !menu.internal) && hasPermission(menu, userPermissions))
              .map((menu) => filterMenuWithSubMenus(menu, userPermissions))
              .map((menu, index) => (
                <MenuSection key={`${index}menu`} menuData={menu} />
              ))}
          </Stack>
        </Box>

        <Stack direction="row" alignItems="center" gap="12px">
          {!!session ? (
            <AccountMenu userName={session.user?.name || ""} />
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold hover:opacity-80 cursor-pointer"
            >
              Đăng nhập
            </Link>
          )
          }
          <IconButton>
            <LanguageIcon sx={{ fontSize: 25 }} />
          </IconButton>
        </Stack>
      </Stack>

      <Drawer anchor="left" open={openSideMenu} onClose={handleToggleSideMenu}>
        <VerticalMenu 
          menuDatas={menuData
            .filter((menu) => hasPermission(menu, userPermissions))
            .map((menu) => filterMenuWithSubMenus(menu, userPermissions))
          } 
        />
      </Drawer>
    </Box>
  );
};

export default Header;
