import './globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';
import { LoadingProvider } from '../context/LoadingContext';
import GlobalLoadingWrapper from '../components/GlobalLoadingWrapper';

export const metadata = {
  title: 'Paaskeeper',
  description: 'Your secure password & 2FA manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LoadingProvider>
          <AuthProvider>
            <Navbar />
            <GlobalLoadingWrapper>
              {children}
            </GlobalLoadingWrapper>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
