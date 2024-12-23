// pages/_app.tsx
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider from next-auth
import { Provider } from "react-redux"; // Import Redux Provider
import { store } from "../store/store"; // Adjust the import path as needed
import "../styles/globals.css"; // Import global styles
import { DarkModeProvider } from "@/contexts/DarkModeContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <DarkModeProvider>
          <Component {...pageProps} />
        </DarkModeProvider>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
