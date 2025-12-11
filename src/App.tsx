import React, { useEffect, Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import "./App.css";

// Error Boundary Component
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Unexpected Error
            </h1>
            <p className="text-gray-600 mb-4">
              Sorry, something went wrong. Please reload the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  useEffect(() => {
    // PWA initialization
    const initPWA = async () => {
      try {
        // Update manifest in HTML
        const link = document.querySelector(
          'link[rel="manifest"]'
        ) as HTMLLinkElement;
        if (!link) {
          const manifestLink = document.createElement("link");
          manifestLink.rel = "manifest";
          manifestLink.href = "/manifest.json";
          document.head.appendChild(manifestLink);
        }

        // Add meta tags for mobile app
        const viewport = document.querySelector(
          'meta[name="viewport"]'
        ) as HTMLMetaElement;
        if (viewport) {
          viewport.content =
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
        }

        // Add theme color
        let themeColor = document.querySelector(
          'meta[name="theme-color"]'
        ) as HTMLMetaElement;
        if (!themeColor) {
          themeColor = document.createElement("meta");
          themeColor.name = "theme-color";
          themeColor.content = "#6366f1";
          document.head.appendChild(themeColor);
        }

        // Add apple-mobile-web-app meta tags
        const appleMeta = [
          { name: "apple-mobile-web-app-capable", content: "yes" },
          { name: "apple-mobile-web-app-status-bar-style", content: "default" },
          {
            name: "apple-mobile-web-app-title",
            content: "Knoux SmartOrganizer PRO",
          },
        ];

        appleMeta.forEach(({ name, content }) => {
          let meta = document.querySelector(
            `meta[name="${name}"]`
          ) as HTMLMetaElement;
          if (!meta) {
            meta = document.createElement("meta");
            meta.name = name;
            meta.content = content;
            document.head.appendChild(meta);
          }
        });

        console.log("✅ PWA initialized successfully");
      } catch (error) {
        console.error("❌ PWA initialization failed:", error);
      }
    };

    initPWA();

    // Add beforeunload handler to save state
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      try {
        localStorage.setItem(
          "knoux-app-state",
          JSON.stringify({
            timestamp: Date.now(),
            url: window.location.pathname,
          })
        );
      } catch (error) {
        console.error("Failed to save app state:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
          <ErrorBoundary>
            <Routes>
              {/* Main application page */}
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <Index />
                  </ErrorBoundary>
                }
              />

              {/* Redirect old routes to main page */}
              <Route path="/simple" element={<Navigate to="/" replace />} />
              <Route path="/ultimate" element={<Navigate to="/" replace />} />
              <Route path="/organizer" element={<Navigate to="/" replace />} />
              <Route path="/powerful" element={<Navigate to="/" replace />} />
              <Route path="/legacy" element={<Navigate to="/" replace />} />
              <Route path="/remove-duplicate" element={<Navigate to="/" replace />} />
              <Route path="/remove-duplicate-pro" element={<Navigate to="/" replace />} />
              <Route path="/live-preview-demo" element={<Navigate to="/" replace />} />
              <Route path="/example-usage" element={<Navigate to="/" replace />} />
              <Route path="/ai-analysis" element={<Navigate to="/" replace />} />

              {/* 404 page */}
              <Route
                path="*"
                element={
                  <ErrorBoundary>
                    <NotFound />
                  </ErrorBoundary>
                }
              />
            </Routes>
          </ErrorBoundary>

          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={5000}
            theme="system"
            toastOptions={{
              style: {
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
