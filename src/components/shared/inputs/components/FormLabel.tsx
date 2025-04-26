import { FormLabel as MFormLabel, styled } from "@mui/material";

const FormLabel = styled(MFormLabel)({
  color: "#707070",
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: "20px",
  display: "flex",
  alignItems: "center",
  marginBottom: "4px",
  whiteSpace: "pre-wrap",
  cursor: "auto",

  "&.Mui-focused": {
    color: "#292929",
  },
});

export { FormLabel };
