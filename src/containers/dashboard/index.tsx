import { HeroVideo } from "@/shared/components/HeroVideo";
import { appRoutes } from "@/shared/constants/routes";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bike,
  Camera,
  CheckCircle,
  ChevronDown,
  FileText,
  Shield,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const STEPS = [
  {
    icon: Bike,
    title: "Motorcycle registered",
    description:
      "Your motorcycle becomes a digital asset with its own blockchain identity.",
  },
  {
    icon: Wrench,
    title: "Service documented",
    description:
      "Every repair is captured with before and after photos, invoices and parts.",
  },
  {
    icon: Shield,
    title: "Records verified",
    description:
      "Each record is cryptographically sealed and stored permanently on-chain.",
  },
];

const INCLUDED = [
  {
    icon: Camera,
    title: "Before & after photos",
    description: "Visual proof of every repair performed",
  },
  {
    icon: FileText,
    title: "Invoices & documents",
    description: "Complete financial documentation",
  },
  {
    icon: Wrench,
    title: "Parts & labour",
    description: "Detailed breakdown of work performed",
  },
  {
    icon: CheckCircle,
    title: "Blockchain proof",
    description: "Immutable verification of service",
  },
];

const Dashboard = () => {
  return (
    <div>
      {/* Hero */}
      <HeroVideo className="min-h-[640px] h-[calc(100svh-64px)]">
        <div className="container mx-auto flex h-full flex-col justify-end px-4 pb-20 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-center md:text-left"
          >
            <span className="u-eyebrow inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Blockchain-verified records
            </span>
            <h1 className="u-display mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-7xl">
              Your motorcycle's
              <br />
              service history,
              <br />
              <span className="text-primary">on the record.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base text-mist-200 md:mx-0 md:text-lg">
              Every repair and service, with photos, invoices and parts, sealed
              on the blockchain so it can never be altered.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start">
              <Link to={appRoutes.vaults.path} className="btn-primary">
                View your motorcycles
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how-it-works" className="btn-ghost">
                How it works
              </a>
            </div>
          </motion.div>
        </div>
        <motion.a
          href="#how-it-works"
          aria-label="Scroll to how it works"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </motion.a>
      </HeroVideo>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-16 py-20 md:py-28">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div {...fadeInUp} className="mb-12 text-center">
            <span className="u-eyebrow">How it works</span>
            <h2 className="u-display mt-3 text-3xl md:text-4xl">
              A record that can't be rewritten
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {STEPS.map((item, i) => (
              <motion.div
                key={item.title}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="u-glass group p-6 transition-colors hover:border-neon-400/50"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="u-tile h-11 w-11">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-base">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="border-y border-border bg-abyss-900/60 py-20 md:py-28">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div {...fadeInUp} className="mb-12 text-center">
            <span className="u-eyebrow">Every record includes</span>
            <h2 className="u-display mt-3 text-3xl md:text-4xl">
              The full picture of each service
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED.map((item, i) => (
              <motion.div
                key={item.title}
                {...stagger}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="u-card p-5 transition-colors hover:border-neon-400/50"
              >
                <item.icon className="mb-4 h-5 w-5 text-primary" />
                <h4 className="mb-1 text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div
            {...fadeInUp}
            className="u-glass relative overflow-hidden px-6 py-14 text-center md:px-12"
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-neon-400/15 blur-3xl" />
            <h2 className="u-display relative text-3xl md:text-4xl">
              Ready to open your history?
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">
              Your complete, blockchain-verified service records are a click
              away.
            </p>
            <Link
              to={appRoutes.vaults.path}
              className="btn-primary relative mt-8"
            >
              View your motorcycles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
