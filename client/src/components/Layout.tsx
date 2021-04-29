import React from "react";
import { Navbar } from "./Navbar";
import { Wrapper, WrapperType } from "./Wrapper";

interface LayoutProps {
  variant: WrapperType;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <Navbar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
