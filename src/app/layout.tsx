import type { Metadata } from "next";
import "./globals.css";
import { ActionLayerProvider } from "./providers";

export const metadata: Metadata = {
  title: "Aliigo Action Layer — WebMCP Challenge",
  description: "Make a business usable by people and their agents with structured, approved knowledge and safe WebMCP tools.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ActionLayerProvider>{children}</ActionLayerProvider></body></html>;
}
