import type { Metadata } from "next";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "./globals.css";
import "@mantine/notifications/styles.css";
import { Poppins } from "next/font/google";

const font = Poppins({ subsets: ["latin"], weight: "500" });

export const metadata: Metadata = {
  title: "Job Fair",
  description: "Job fair forms for Cryptex.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className}`}>
        <MantineProvider
          theme={{
            breakpoints: {
              xs: "0",
              sm: "640",
              md: "768",
              lg: "1024",
              xl: "1280",
            },
          }}
        >
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
