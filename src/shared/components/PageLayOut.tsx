import { GlobalSelectors } from "@/containers/global/selectors";
import React from "react";
import { useSelector } from "react-redux";
import { Footer } from "./Footer";
import { Header } from "./Header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const authData = useSelector(GlobalSelectors.authData);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {authData ? (
        <>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PageLayout;
