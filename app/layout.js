import { Bitter, Geist, Geist_Mono, Inter, Outfit, Poppins } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";

const popins = Outfit({
  variable: "--font-popins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bitter = Bitter({
  variable: "--font-bitter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "RM Roofing and Contracting LLC",
  description:
    "RM Roofing and Contracting LLC provides roof inspections, emergency leak repair, roof replacement, maintenance, and structural reinforcement services built for lasting protection.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${popins.variable} ${bitter.variable} ${inter.variable}  h-full antialiased`}
    >
      <body className="min-h-full bg-foreground flex flex-col">
        <Navbar />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
