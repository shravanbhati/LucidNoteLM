import "./globals.css";

export const metadata = {
  title: "LucidNoteLM",
  description: "NotebookML app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black">{children}</body>
    </html>
  );
}
