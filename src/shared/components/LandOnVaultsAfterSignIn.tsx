import { GlobalSelectors } from "@/containers/global/selectors";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { appRoutes } from "../constants/routes";

/**
 * Signing in on the home page lands on the motorcycle list. A sign-in on any
 * other page (a deep link) stays where it is, and the home page stays
 * reachable from the header once signed in.
 */
const LandOnVaultsAfterSignIn = () => {
  const authData = useSelector(GlobalSelectors.authData);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const wasSignedIn = useRef(Boolean(authData));

  useEffect(() => {
    const signedIn = Boolean(authData);
    if (
      signedIn &&
      !wasSignedIn.current &&
      pathname === appRoutes.dashboard.path
    ) {
      navigate(appRoutes.vaults.path, { replace: true });
    }
    wasSignedIn.current = signedIn;
  }, [authData, pathname, navigate]);

  return null;
};

export default LandOnVaultsAfterSignIn;
