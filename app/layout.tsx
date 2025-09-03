import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/u-d.svg";
import "./globals.css";
import { Manrope as Font } from "next/font/google";

import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/lib/user-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/craft";
import { EmailForm } from "@/components/email-form";
import { UserAccountButton } from "@/components/user-account-button";
import { PromoteButton } from "@/components/promote-button";

import { directory } from "@/directory.config";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Mail } from "lucide-react";

const font = Font({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: directory.title,
  description: directory.description,
  metadataBase: new URL(directory.baseUrl),
  icons: {
    icon: [
      { url: '/32.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/64.svg', sizes: '64x64', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <Header />
            {children}
            <Footer />
          </UserProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

const Header = () => {
  return (
    <header>
      <Container className="grid grid-cols-3 items-center gap-3">
        {/* Left: Logo */}
        <Link href="/" className="transition-all hover:opacity-80">
          <Image
            src={Logo}
            alt="Unusual Directory Logo"
            width={120}
            height={49.6}
            className="dark:invert"
          />
        </Link>
        
        {/* Center: Navigation Menu */}
        <nav className="hidden md:flex items-center justify-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>
        
        {/* Right: Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          <UserAccountButton />
          <ThemeToggle />
          <PromoteButton />
        </div>
      </Container>
    </header>
  );
};

const Footer = () => {
  return (
    <footer>
      <Container className="flex items-center justify-center gap-3">
        <div className="grid gap-1 text-xs text-muted-foreground text-center">
          <p>
            © {new Date().getFullYear()} unusual-directory.
          </p>
          <p>
            Built with ❤️ for the open source community.
          </p>
        </div>
      </Container>
    </footer>
  );
};

const Subscribe = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center">
          <Mail className="mr-2 h-3 w-3" /> Subscribe
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe for more resources</DialogTitle>
          <DialogDescription>
            Get notified when new resources are added.
          </DialogDescription>
        </DialogHeader>
        <EmailForm />
        <div className="h-px" />
      </DialogContent>
    </Dialog>
  );
};
