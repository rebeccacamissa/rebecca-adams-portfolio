/* Camel Editorial Atelier: the app shell keeps the portfolio single-page, light-first, and theme-switchable. */
import Home from "@/pages/Home.tsx";
import { ThemeProvider } from "@/contexts/ThemeContext.tsx";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" switchable>
      <Home />
    </ThemeProvider>
  );
}
