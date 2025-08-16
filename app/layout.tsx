import Link from "next/link";
import "./globals.css";

export const metadata = { title: "Order Intake Cloud" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>
      <nav className="nav">
        <div className="title" style={{ marginRight: 8 }}>Order Ops</div>
        <Link href="/">Intake</Link>
        <Link href="/ops">Operations</Link>
        <Link href="/ops/create">Manual Create</Link>
        <Link href="/export">Export</Link>
        <span className="small" style={{ marginLeft: "auto" }}>
          Press <kbd className="kbd">?</kbd> for shortcuts
        </span>
      </nav>
      <div className="container">{children}</div>
    </body></html>
  );
}
