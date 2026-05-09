import './globals.css';
import { ApolloAppProvider } from '../src/providers/apollo-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloAppProvider>{children}</ApolloAppProvider>
      </body>
    </html>
  );
}
