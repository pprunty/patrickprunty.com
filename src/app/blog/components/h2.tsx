import { ReactNode } from "react";
import { withHeadingId } from "./utils";

interface HeadingProps {
  children?: ReactNode; // Ensures children can be any valid React element
}

export function H2({ children }: HeadingProps) {
  return (
    <h2 className="group font-bold text-xl my-8 relative">
      {withHeadingId(children)}
    </h2>
  );
}
