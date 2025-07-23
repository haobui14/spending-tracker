import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import TranslateIcon from "@mui/icons-material/Translate";
import { auth } from "../utils/firebase";
import { clearAllCache } from "../utils/cacheManager";
import appTheme from "../theme";

export default function NavBar({ mode, toggleMode }) {
  const { t, language } = useTranslation();
  const { toggleLanguage } = useLanguage();
  
  const handleLogout = () => {
    // Clear all cached data on logout using cache manager
    clearAllCache();
    // Force page reload to clear any remaining cache
    auth.signOut().then(() => {
      window.location.reload();
    });
  };
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        background: appTheme.colors.navbar.background,
        backdropFilter: "blur(8px)",
        borderRadius: 0,
        boxShadow: `0 2px 16px 0 ${appTheme.colors.navbar.hover}`,
        borderBottom: `1px solid ${appTheme.colors.navbar.border}`,
        width: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          width: "100%",
          px: isMobile ? 1 : 3,
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: isMobile ? 56 : 72,
            px: 0,
            width: "100%",
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src="/pwa-192x192.png"
              alt="logo"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
            <Typography
              variant="h6"
              fontWeight={800}
              color="black"
              sx={{
                letterSpacing: 1,
                fontSize: isMobile ? 18 : 24,
                whiteSpace: "nowrap",
                userSelect: "none",
                color: "black",
              }}
            >
              {t('spendingTracker')}
            </Typography>
          </Box>
          {isMobile ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={toggleLanguage}
                  color="inherit"
                  sx={{ 
                    color: "black",
                    minWidth: 44,
                    height: 44,
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover": {
                      background: "rgba(25,118,210,0.08)",
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <TranslateIcon sx={{ 
                      color: "black", 
                      fontSize: 20 
                    }} />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: "black", 
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        lineHeight: 1
                      }}
                    >
                      {language.toUpperCase()}
                    </Typography>
                  </Box>
                </IconButton>
                <IconButton
                  onClick={toggleMode}
                  color="inherit"
                  sx={{ color: "black" }}
                >
                  {mode === "dark" ? (
                    <Brightness7Icon sx={{ color: "black" }} />
                  ) : (
                    <Brightness4Icon sx={{ color: "black" }} />
                  )}
                </IconButton>
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  color="inherit"
                  sx={{ 
                    color: "black",
                    ml: 0.5 
                  }}
                >
                  <MenuIcon sx={{ color: "black" }} />
                </IconButton>
              </Box>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{ 
                  sx: { 
                    background: appTheme.colors.navbar.drawer, 
                    color: appTheme.colors.text.inverse 
                  } 
                }}
              >
                <Box sx={{ width: 220, pt: 2 }} role="presentation">
                  <List>
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={location.pathname === "/dashboard"}
                        onClick={() => handleNav("/dashboard")}
                      >
                        <ListItemIcon sx={{ color: "white" }}>
                          <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('dashboard')} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={location.pathname === "/calendar"}
                        onClick={() => handleNav("/calendar")}
                      >
                        <ListItemIcon sx={{ color: "white" }}>
                          <CalendarMonthIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('monthlyCalendar')} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={handleLogout}
                        sx={{
                          color: appTheme.colors.navbar.logout,
                          mt: 1,
                          borderTop: 1,
                          borderColor: "rgba(255,255,255,0.12)",
                        }}
                      >
                        <ListItemIcon sx={{ color: appTheme.colors.navbar.logout }}>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('logout')} />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                color={
                  location.pathname === "/dashboard" ? "primary" : "inherit"
                }
                startIcon={<DashboardIcon />}
                onClick={() => navigate("/dashboard")}
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: location.pathname === "/dashboard" ? 2 : 0,
                  background:
                    location.pathname === "/dashboard"
                      ? "rgba(33,154,111,0.08)"
                      : "transparent",
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "rgba(33,154,111,0.15)",
                  },
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  color: "black",
                }}
              >
                {t('dashboard')}
              </Button>
              <Button
                color={
                  location.pathname === "/calendar" ? "primary" : "inherit"
                }
                startIcon={<CalendarMonthIcon />}
                onClick={() => navigate("/calendar")}
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: location.pathname === "/calendar" ? 2 : 0,
                  background:
                    location.pathname === "/calendar"
                      ? "rgba(33,154,111,0.08)"
                      : "transparent",
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "rgba(33,154,111,0.15)",
                  },
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  color: "black",
                }}
              >
                {t('monthlyCalendar')}
              </Button>
              <Button
                onClick={toggleLanguage}
                startIcon={<TranslateIcon />}
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "rgba(25,118,210,0.08)",
                  },
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  color: "black",
                }}
              >
                {language === "en" ? "ENG" : "VIE"}
              </Button>
              <IconButton
                onClick={toggleMode}
                color="inherit"
                sx={{ ml: 1, color: "black" }}
              >
                {mode === "dark" ? (
                  <Brightness7Icon sx={{ color: "black" }} />
                ) : (
                  <Brightness4Icon sx={{ color: "black" }} />
                )}
              </IconButton>
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  fontWeight: 700,
                  fontSize: 16,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "rgba(255,77,77,0.08)",
                  },
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  color: appTheme.colors.navbar.logout,
                }}
              >
                {t('logout')}
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
