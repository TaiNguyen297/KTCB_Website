import React from "react";
import opportunityData from "../../../utils/data/json/oppotunity.json";
import { Stack, Typography, Button, Paper, Box } from "@mui/material";
import { COLORS } from "@/utils/constants";

export const Opportunity: React.FC = () => {
  return (
    <Stack alignItems="center" my={8}>
      <Paper elevation={3} sx={{ width: ["80%", "70%"] }}>
        <Stack
          direction="row"
          justifyContent={["center", "center", "center", "space-between"]}
          alignItems="center"
          px={4}
          py={2}
          flexWrap="wrap"
        >
          <Typography
            mb={[2, 2, 2, 0]}
            variant="h5"
            fontWeight="bold"
            minWidth="100px"
            textAlign="center"
          >
            {opportunityData.title}
          </Typography>
          <Stack sx={{ minWidth: "250px" }} spacing={2} direction="row">
            <Button
              variant="contained"
              sx={{
                backgroundColor: COLORS.PINK,
                minWidth: "110px",
                marginRight: 2,
              }}
            >
              {opportunityData.button1}
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: COLORS.PINK, minWidth: "110px" }}
            >
              {opportunityData.button2}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};
