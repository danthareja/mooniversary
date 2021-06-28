import "@/styles/globals.css";
import { MoonSliderProvider } from "@/components";
function MyApp({ Component, pageProps }) {
  return (
    <MoonSliderProvider size={120}>
      <Component {...pageProps} />
    </MoonSliderProvider>
  );
}

export default MyApp;
