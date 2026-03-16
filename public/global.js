// styles.js
import { StyleSheet } from "react-native";

const COLORS = {
  primary:"#3B82F6",   // Blue
  secondary: "#10B981", // Green
  error: "#EF4444",     // Red
  text: "#111827",      // Dark gray
  subtext: "#6B7280",   // Gray
  background: "#fef4deff", // Light gray
  primaryBtn : "#003366",  // dark blue
  secondaryBtn : "#90bfefff"  // lighter blue
};

const LinearColor = {
  Pri_Sec_Pri : ["#3B82F6","#90bfefff","#3B82F6"],
  Sec_Pri_Sec : ["#90bfefff","#3B82F6","#90bfefff"],
  PriBtn_Sec_PriBtn : ["#90bfefff","#003366","#90bfefff"],
  Sec_PriBtn_Sec : ["#003366","#90bfefff","#003366"]
}

const TextCOLORS = {
  primary:{color:"#3B82F6"},   // Blue
  secondary:{color:"#10B981"}, // Green
  error:{color:"#EF4444"},     // Red
  text: {color:"#111827"},      // Dark gray
  subtext: {color:"#6B7280"},   // Gray
  background: {color:"#F9FAFB"} // Light gray
};

const FONTS = {
  logo: { fontSize: 34, fontWeight: "bold", color: COLORS.primary },
  title: { fontSize: 20, fontWeight: "600", color: COLORS.text },
  heading: { fontSize: 20, fontWeight: "600", color: COLORS.text },
  label: { fontSize: 16, fontWeight: "500", color: COLORS.text },
  body: { fontSize: 14, fontWeight: "400", color: COLORS.text },
  small: { fontSize: 12, fontWeight: "400", color: COLORS.subtext },
  error: { fontSize: 12, fontWeight: "400", color: COLORS.error }
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

// Example usage with StyleSheet
const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md
  },
  titleText: {
    ...FONTS.title,
    marginBottom: SPACING.sm
  },
  bodyText: {
    ...FONTS.body,
    marginBottom: SPACING.sm
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: {
    ...FONTS.label,
    color: "#fff"
  }
});


export {globalStyles,SPACING,ICONS,FONTS,COLORS,TextCOLORS,LinearColor}