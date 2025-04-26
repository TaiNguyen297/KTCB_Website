import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { Typography } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

interface AccountMenuProps {
  userName: string;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ userName }) => {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null | undefined>();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleMenuMouseEnter = () => {
      if (!anchorEl) return;
      setAnchorEl(null);
    };

    if (menuRef.current) {
      menuRef.current.addEventListener("mouseenter", handleMenuMouseEnter);
    }

    return () => {
      if (menuRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        menuRef.current.removeEventListener("mouseenter", handleMenuMouseEnter);
      }
    };
  }, [anchorEl]);

  const handleGotoProfile = () => {
    router.push("/profile");

    handleClose();
  };

  const handleLogout = () => {
    signOut();

    handleClose();
  };

  return (
    <React.Fragment>
      <Typography
        ref={buttonRef}
        onMouseOver={handleClick}
        onMouseLeave={handleClose}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClick(e)}
        className="text-sm font-semibold hover:opacity-80 cursor-pointer z-[9999]"
      >
        Chào {userName}
      </Typography>
      <Menu
        disableAutoFocusItem
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          onMouseLeave: handleClose,
          onMouseOver: () => setAnchorEl(buttonRef.current),
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleGotoProfile}>
          <Avatar /> Chỉnh sửa thông tin
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
