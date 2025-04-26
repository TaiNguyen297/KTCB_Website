import { Box, Grid, Tab, Tabs } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { TabPanel, a11yProps } from "./TabPannel";

export interface TabProps {
  tabElement: TabElement[];
  tabIndex?: number;
}

export interface TabElement {
  title: React.ReactElement | JSX.Element | string;
  element: React.ReactElement;
}

const TabBase = (props: TabProps) => {
  const { tabElement, tabIndex } = props;

  const { watch, setValue } = useForm<{ tabIndex: number }>({
    defaultValues: {
      tabIndex: tabIndex ?? 0,
    },
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue("tabIndex", newValue);
  };

  return (
    <Box>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <Grid item xs={12} sx={{ display: "flex", flexDirection: "row" }}>
          <Tabs
            value={watch("tabIndex")}
            onChange={handleChange}
            sx={{ ...tabListStyle }}
            aria-label="icon label tabs example"
          >
            {tabElement.map((element, index) => {
              return (
                <Tab
                  sx={{ ...tabItemStyle }}
                  key={index}
                  icon={element.title}
                  {...a11yProps(index)}
                />
              );
            })}
          </Tabs>
        </Grid>
      </Grid>

      {tabElement.map((element, index) => {
        return (
          <TabPanel key={index} value={watch("tabIndex")} index={index}>
            {React.cloneElement(element.element)}
          </TabPanel>
        );
      })}
    </Box>
  );
};
const tabItemStyle = {
  minWidth: { xs: "118px", sm: "150px", md: "195px" },
  textAlign: "center",
  color: "#404DA8 !important",
  padding: "8px 12px",
  whiteSpace: "nowrap",
  borderRadius: "8px 8px 0 0",
  marginRight: "4px",
  fontSize: "14px !important",
  backgroundColor: "#f0f0f0",
  borderBottom: "2px solid transparent",

  "&:hover": {
    backgroundColor: "#fff",
    borderBottom: "2px solid #146BD2",
  },

  "@media (min-width: 1024px) and (max-width: 1366px)": {
    minWidth: "150px",
  },

  "& button": {
    color: "#111",
  },
};

const tabListStyle = {
  color: "#404DA8 !important",
  borderRadius: "8px 8px 0 0",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "20px",
  textTransform: "inherit",
  textAlign: "center",
  whiteSpace: "nowrap",
  "@media (max-width: 600px)": {
    minWidth: 0,
  },
  "@media (min-width: 768px) and (max-width: 1180px)": {
    minWidth: "150px",
  },
  "& .Mui-selected": {
    color: "#404DA8",
    backgroundColor: "#fff",
    boxShadow:
      "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",

    "& button": {
      color: "#404DA8",
    },
  },
  "& .MuiTabs-scroller": {
    overflow: "auto !important",
    "::-webkit-scrollbar": { width: 4, height: 8 },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: "#F0F0F0",
    },
  },
};

export { TabBase };
