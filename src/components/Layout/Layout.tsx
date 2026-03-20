import type { ReactNode } from "react";
import classes from "./Layout.module.css";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className={classes.layout}>{children}</div>;
}
