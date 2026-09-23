import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-abyss-900 py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <Logo />
        <span className="text-sm text-muted-foreground">
          Verified motorcycle service, recorded on the blockchain
        </span>
        <div className="flex gap-6">
          <a
            href="/contact"
            className="text-sm text-muted-foreground transition-colors hover:text-glow-50"
          >
            Contact Us
          </a>
          <a
            href="/service-terms"
            className="text-sm text-muted-foreground transition-colors hover:text-glow-50"
          >
            Service Terms
          </a>
        </div>
      </div>
    </footer>
  );
};
