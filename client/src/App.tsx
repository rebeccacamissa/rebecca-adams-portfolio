/* Camel Editorial Atelier: the app shell keeps the portfolio single-page, light-first, and theme-switchable. */
import Home from "@/pages/Home";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" switchable>
      <Home />
    </ThemeProvider>
  );
}
