//@ts-nocheck
import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  MenuItem,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MenuSection = ({ menuData }) => {
  const { name, path, subMenus } = menuData;

  return (
    <Accordion>
      {!subMenus ? (
        <MenuItem
          sx={{
            height: "48px",
          }}
        >
          <a href={path}>{name}</a>
        </MenuItem>
      ) : (
        <AccordionSummary
          sx={{
            height: "48px",
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography>{name}</Typography>
        </AccordionSummary>
      )}

      <AccordionDetails>
        {!!subMenus &&
          subMenus.map((subMenu, index: number) => {
            if (!subMenu.subMenu2) {
              return (
                <MenuItem key={index} sx={{ py: 2 }}>
                  <a href={subMenu.path}>{subMenu.name}</a>
                </MenuItem>
              );
            }
            return (
              <>
                <Accordion key={subMenu.name}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ boxShadow: "none" }}
                  >
                    <Typography mt={1}>{subMenu.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {subMenu.subMenu2.map((item: any) => {
                      return (
                        <MenuItem key={index} sx={{ py: 2 }}>
                          <a href={item.path}>{item.name}</a>
                        </MenuItem>
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
              </>
            );
          })}
      </AccordionDetails>
    </Accordion>
  );
};

const VerticalMenu = ({ menuDatas }) => {
  return (
    <div>
      {menuDatas.map((menu, index) => (
        <MenuSection key={index} menuData={menu} />
      ))}
    </div>
  );
};

export default VerticalMenu;
