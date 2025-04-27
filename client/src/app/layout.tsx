import Link from "next/link";
import "./globals.css";
import { AuthContextProvider, WebSocketProvider } from "../../modules";
export const metadata = {
  title: "NextChat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthContextProvider>
        <WebSocketProvider>
          <body className="h-14 bg-zinc-200">
            {/* Header */}
            <header className="bg-blue-600 text-slate-secondary font-bold py-4 shadow-md">
              <div className="container mx-auto flex justify-between items-center">
                <Link
                  href="/"
                  className="text-2xl font-bold text-slate-secondary"
                >
                  next chat
                </Link>
                <nav>
                  <ul className="flex space-x-4">
                    <li>
                      <Link href="/" className="hover:text-gray-300">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/cart" className="hover:text-gray-300">
                        bla
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>
            <main className="container mx-auto p-4">{children}</main>

            {/* Footer */}
            <footer className="bg-blue-600 text-slate-secondary py-4 mt-8">
              <div className="container mx-auto text-center">
                <p>&copy; 2025 Next Chat</p>
              </div>
            </footer>
          </body>
        </WebSocketProvider>
      </AuthContextProvider>
    </html>
  );
}
