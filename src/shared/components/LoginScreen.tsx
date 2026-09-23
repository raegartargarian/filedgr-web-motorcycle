import { useWeb3Auth } from "@/containers/global/Web3AuthProvider";
import { HeroIntro } from "@/shared/components/HeroIntro";
import { Logo } from "@/shared/components/Logo";
import { ArrowRight, Loader2 } from "lucide-react";

/**
 * Pre-auth screen. The Web3Auth modal opens automatically on load (see
 * GlobalProvider); this gives it a stage to sit on and a way back in if the
 * viewer closes it. The top bar mirrors the signed-in header's height and
 * logo position so the landing page lands in place after sign-in.
 */
export const LoginScreen = () => {
  const { login, isLoading } = useWeb3Auth() || {};

  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b border-transparent">
        <div className="container mx-auto flex h-full items-center px-4">
          <Logo asLink={false} />
        </div>
      </div>
      <HeroIntro
        eyebrow="Blockchain-verified service records"
        title={["Every ride.", "Every service.", "Verified."]}
        subtitle="Sign in to open your motorcycle's complete, tamper-proof service history."
        actions={
          <button
            type="button"
            onClick={() => login?.()}
            disabled={isLoading}
            className="btn-primary disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {isLoading ? "Connecting" : "Sign in"}
          </button>
        }
      />
    </div>
  );
};

export default LoginScreen;
