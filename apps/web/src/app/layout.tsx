import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./enhancements.css";
import "./font.css";
import "./spacing.css";
import { Providers } from "./providers";
import { Header } from "@/components/header";
const sans = DM_Sans({ subsets: ["latin"], variable: "--sans" }); const display = Playfair_Display({ subsets: ["latin"], variable: "--display" });
export const metadata: Metadata = { title: "FeastFleet — Good food, delivered", description: "Freshly prepared favourites delivered to your door." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${sans.variable} ${display.variable}`}><Providers><Header/><main>{children}</main><footer><div className="brand">Feast<span>Fleet</span></div><p>Made fresh. Delivered with care.</p><p>© 2026 FeastFleet</p></footer></Providers></body></html>; }
