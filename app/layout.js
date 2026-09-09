import "./globals.css";
import { PresentationProvider } from "../lib/store";

export const metadata = {
  title: "DeckAI — AI Presentation Maker",
  description:
    "Create stunning presentations in seconds. Enter a topic, choose a style, and let AI generate beautifully designed slides you can edit and export.",
  keywords: "AI presentations, slide generator, presentation maker, AI slides, deck builder",
  openGraph: {
    title: "DeckAI — AI Presentation Maker",
    description:
      "Create stunning presentations in seconds with AI. Beautiful templates, smart content generation, one-click export.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PresentationProvider>{children}</PresentationProvider>
      </body>
    </html>
  );
}
