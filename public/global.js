// styles.js
import { StyleSheet } from "react-native";

const COLORS = {
  primary: "#3B82F6",   // Blue
  secondary: "#10B981", // Green
  error: "#EF4444",     // Red
  text: "#111827",      // Dark gray
  subtext: "#6B7280",   // Gray
  background: "#F8FAFC", // Light background
  card: "#FFFFFF",
  border: "#E2E8F0",
  primaryBtn: "#003366",  // dark blue
  secondaryBtn: "#90bfefff"  // lighter blue
};

const DARK_COLORS = {
  primary: "#60A5FA",   // Lighter blue for dark mode
  secondary: "#34D399",
  error: "#F87171",
  text: "#F9FAFB",      // Light text
  subtext: "#9CA3AF",   // Light gray
  background: "#0F172A", // Dark navy background
  card: "#1E293B",      // Darker navy card
  border: "#334155",
  primaryBtn: "#3B82F6",
  secondaryBtn: "#1E3A8A"
};

const LinearColor = {
  Pri_Sec_Pri: ["#3B82F6", "#90bfefff", "#3B82F6"],
  Sec_Pri_Sec: ["#90bfefff", "#3B82F6", "#90bfefff"],
  PriBtn_Sec_PriBtn: ["#90bfefff", "#003366", "#90bfefff"],
  Sec_PriBtn_Sec: ["#003366", "#90bfefff", "#003366"]
};

const FONTS = {
  logo: { fontSize: 34, fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "800" },
  heading: { fontSize: 20, fontWeight: "700" },
  label: { fontSize: 16, fontWeight: "600" },
  body: { fontSize: 14, fontWeight: "500" },
  small: { fontSize: 12, fontWeight: "500" },
  error: { fontSize: 12, fontWeight: "500", color: COLORS.error }
};

const ICONS = {
  logo: 80,
  nav: 24,
  button: 20,
  status: 14,
  illustration: 150
};

const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24
};

// Helper to get active theme colors
const getTheme = (isDark) => (isDark ? DARK_COLORS : COLORS);

export { SPACING, ICONS, FONTS, COLORS, DARK_COLORS, LinearColor, getTheme };