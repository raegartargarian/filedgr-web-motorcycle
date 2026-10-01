import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWeb3Auth } from "@/containers/global/Web3AuthProvider";
import { cn } from "@/lib/utils";
import { useWalletAddress } from "@filedgr/web-core/auth";
import { truncateAddress } from "@filedgr/web-core/format";
import { useIsMobileOrTablet } from "@filedgr/web-core/react";
import { LogOut, Mail, Menu, Wallet } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { appRoutes } from "../constants/routes";
import { CopyableHash } from "./CopyableHash";
import { Logo } from "./Logo";

const NAV = [
  { to: appRoutes.dashboard.path, label: "Home", end: true },
  { to: appRoutes.vaults.path, label: "My Motorcycles", end: false },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "relative py-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-[21px] after:h-px after:bg-primary after:opacity-0 after:transition-opacity",
    isActive
      ? "text-primary after:opacity-100"
      : "text-mist-200 hover:text-glow-50",
  );

/**
 * The signed-in account: the login email when there is one, otherwise the
 * wallet address (e.g. an external-wallet login carries no email).
 */
const Account = () => {
  const { user } = useWeb3Auth() || {};
  const walletAddress = useWalletAddress();
  const email: string | undefined = user?.email;

  if (email) {
    return (
      <span className="flex min-w-0 items-center gap-2" title={email}>
        <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="truncate text-sm text-mist-200">{email}</span>
      </span>
    );
  }
  if (!walletAddress) return null;
  return (
    <span className="flex items-center gap-2">
      <Wallet className="h-3.5 w-3.5 text-primary" />
      <CopyableHash
        value={walletAddress}
        display={truncateAddress(walletAddress)}
      />
    </span>
  );
};

export const Header = () => {
  const { user, logout } = useWeb3Auth() || {};
  const walletAddress = useWalletAddress();
  const isMobile = useIsMobileOrTablet();
  const hasAccount = Boolean(user?.email || walletAddress);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border/60 bg-abyss-900/70 backdrop-blur-md">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Logo />

        {!isMobile && (
          <nav className="flex items-center gap-8">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {hasAccount && !isMobile && (
            <span className="flex max-w-64 items-center rounded-full border border-border bg-steel-800/80 py-1.5 pl-3 pr-3">
              <Account />
            </span>
          )}

          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open menu"
                className="rounded-lg p-2 text-mist-200 transition-colors hover:bg-steel-700 hover:text-glow-50"
              >
                <Menu size={22} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {NAV.map((item) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
                {hasAccount && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="flex px-2 py-1.5">
                      <Account />
                    </div>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-300 focus:text-red-300"
                >
                  <LogOut size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-mist-200 transition-colors hover:bg-steel-700 hover:text-glow-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
