import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogOut, Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { appRoutes } from "../constants/routes";
import { useWeb3Auth } from "@/containers/global/Web3AuthProvider";

export const Header = () => {
  const { logout, isAuthenticated } = useWeb3Auth() || {};

  const baseClassRoute =
    "hover:text-blue-600 pb-1 transition-colors text-slate-700 font-medium";
  const activeClassRoute =
    baseClassRoute + " border-b-2 text-blue-600 border-b-blue-600";
  const inactiveClassRoute =
    baseClassRoute + " text-slate-700 hover:text-blue-600";

  return (
    <>
      <header className="bg-white text-slate-900 h-[64px] border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-full items-center justify-between px-4">
          {/* Hamburger Menu for mobile/tablet */}
          <div className="md:hidden text-slate-900 focus:outline-none">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded">
                <Menu size={24} className="text-slate-700" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-slate-200 shadow-lg">
                <DropdownMenuLabel className="text-slate-900 font-semibold">
                  Navigation
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200" />
                <DropdownMenuItem className="text-slate-700 hover:bg-slate-100 focus:bg-slate-100">
                  <Link
                    to={appRoutes.dashboard.path}
                    className="text-slate-700"
                  >
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-700 hover:bg-slate-100 focus:bg-slate-100">
                  <Link
                    to={appRoutes.vaults.path}
                    className="text-slate-700 hover:text-blue-600"
                  >
                    My Vehicles
                  </Link>
                </DropdownMenuItem>
                {isAuthenticated && (
                  <>
                    <DropdownMenuSeparator className="bg-slate-200" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 hover:bg-red-50 focus:bg-red-50"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Website Title */}
          <Link to="/" className="flex-shrink-0">
            <div className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              Dealership
            </div>
          </Link>

          {/* Menu Links for desktop */}
          <nav className="hidden md:flex space-x-8">
            <NavLink
              to={appRoutes.dashboard.path}
              className={({ isActive }) =>
                isActive ? activeClassRoute : inactiveClassRoute
              }
            >
              Home
            </NavLink>
            <NavLink
              to={appRoutes.vaults.path}
              className={({ isActive }) =>
                isActive ? activeClassRoute : inactiveClassRoute
              }
            >
              My Vehicles
            </NavLink>
          </nav>

          <div className="flex-shrink-0">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <div className="text-sm text-slate-600 font-medium">
                Verified Auto Service
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
