"use client";

import { useMemo } from "react";
import { BaseProvider, LightTheme } from "baseui";
import { Provider as StyletronProvider } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Only create Styletron client engine on the client side
  const engine = useMemo(() => {
    if (typeof window !== "undefined") {
      return new Styletron();
    }
    // Return a dummy engine or handle SSR properly if needed
    // For now, this prevents the "document is not defined" error during build
    return {
      renderStyle: () => "",
      renderKeyframes: () => "",
      renderFontFace: () => "",
    } as unknown as Styletron;
  }, []);

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>{children}</BaseProvider>
    </StyletronProvider>
  );
}
