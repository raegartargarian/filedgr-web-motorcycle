import { GlobalSelectors } from "@/containers/global/selectors";
import React from "react";
import { useSelector } from "react-redux";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LoginScreen } from "./LoginScreen";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const authData = useSelector(GlobalSelectors.authData);

  if (!authData) return <LoginScreen />;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
