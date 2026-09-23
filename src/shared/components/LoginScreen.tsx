import { useWeb3Auth } from "@/containers/global/Web3AuthProvider";
import { HeroVideo } from "@/shared/components/HeroVideo";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";

/**
 * Pre-auth screen. The Web3Auth modal opens automatically on load (see
 * GlobalProvider); this gives it a stage to sit on and a way back in if the
 * viewer closes it.
 */
export const LoginScreen = () => {
  const { login, isLoading } = useWeb3Auth() || {};

  return (
    <HeroVideo className="min-h-screen">
      <div className="flex min-h-screen flex-col">
        <div className="container mx-auto flex h-16 items-center px-4">
          <span className="text-lg font-medium tracking-wide text-glow-50">
            Dealership
          </span>
        </div>

        <div className="container mx-auto flex flex-1 items-end px-4 pb-16 md:items-center md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <span className="u-eyebrow inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Blockchain-verified service records
            </span>
            <h1 className="u-display mt-4 text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              Every ride.
              <br />
              Every service.
              <br />
              <span className="text-primary">Verified.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-mist-200 md:text-lg">
              Sign in to open your motorcycle's complete, tamper-proof service
              history.
            </p>
            <button
              type="button"
              onClick={() => login?.()}
              disabled={isLoading}
              className="btn-primary mt-8 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {isLoading ? "Connecting" : "Sign in"}
            </button>
          </motion.div>
        </div>
      </div>
    </HeroVideo>
  );
};

export default LoginScreen;
