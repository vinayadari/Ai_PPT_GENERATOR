import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />

        {/* Footer */}
        <footer
          style={{
            padding: "var(--space-12) var(--space-8)",
            borderTop: "1px solid var(--border-subtle)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-tertiary)",
            }}
          >
            Built with AI · DeckAI © {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </>
  );
}
