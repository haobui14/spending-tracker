import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        mt: 6,
        py: 4,
        backgroundColor: "#1e293b",
        borderTop: "1px solid #e2e8f0",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: isMobile ? 2 : 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#94a3b8",
            fontFamily: '"Inter", sans-serif',
            mb: 1,
          }}
        >
          Powered by
        </Typography>
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            color: "#ffffff",
            fontFamily: '"Inter", sans-serif',
            mb: 1,
          }}
        >
          SpendingTracker Pro
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Built with ❤️ by{" "}
          <Box
            component="span"
            sx={{
              color: "#3b82f6",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": {
                color: "#60a5fa",
                textDecoration: "underline",
              },
            }}
            onClick={() => window.open("https://github.com/haobui14", "_blank")}
          >
            @haobui14
          </Box>
          {" • "}
          Professional Financial Management Solution
        </Typography>
      </Box>
    </Box>
  );
}
