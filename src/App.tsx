import React, { useEffect, Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import TestPage from "@/pages/TestPage";
import SimplePage from "@/pages/SimplePage";
import UltimatePage from "@/pages/UltimatePage";
import OrganizerPage from "@/pages/OrganizerPage";
import PowerfulWorkingApp from "@/pages/PowerfulWorkingApp";
import WorkingApp from "@/pages/WorkingApp";
import RemoveDuplicatePage from "@/pages/RemoveDuplicatePage";
import RemoveDuplicatePageEnhanced from "./pages/RemoveDuplicatePageEnhanced";
import LivePreviewDemo from "./pages/LivePreviewDemo";
import ExampleUsage from "./pages/ExampleUsage";
import AIAnalysisPage from "./pages/AIAnalysisPage";
import NotFound from "@/pages/NotFound";
import { pwaManager } from "@/lib/pwa-config";
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
              حدث خطأ غير متوقع
            </h1>
            <p className="text-gray-600 mb-4">
              نعتذر، حدث خطأ في التطبيق. يرجى إعادة تحميل الصفحة.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              إعادة تحميل
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
    // تهيئة PWA
    const initPWA = async () => {
      try {
        // تحديث manifest في HTML
        const link = document.querySelector(
          'link[rel="manifest"]',
        ) as HTMLLinkElement;
        if (!link) {
          const manifestLink = document.createElement("link");
          manifestLink.rel = "manifest";
          manifestLink.href = "/manifest.json";
          document.head.appendChild(manifestLink);
        }

        // إضافة meta tags للتطبيق المحمول
        const viewport = document.querySelector(
          'meta[name="viewport"]',
        ) as HTMLMetaElement;
        if (viewport) {
          viewport.content =
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
        }

        // إضافة theme color
        let themeColor = document.querySelector(
          'meta[name="theme-color"]',
        ) as HTMLMetaElement;
        if (!themeColor) {
          themeColor = document.createElement("meta");
          themeColor.name = "theme-color";
          themeColor.content = "#6366f1";
          document.head.appendChild(themeColor);
        }

        // إضافة apple-mobile-web-app meta tags
        const appleMeta = [
          { name: "apple-mobile-web-app-capable", content: "yes" },
          { name: "apple-mobile-web-app-status-bar-style", content: "default" },
          {
            name: "apple-mobile-web-app-title",
            content: "Knoux SmartOrganizer",
          },
        ];

        appleMeta.forEach(({ name, content }) => {
          let meta = document.querySelector(
            `meta[name="${name}"]`,
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

    // إضافة معالج لحدث beforeunload لحفظ البيانات
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // حفظ الحالة الحالية قبل إغلاق التطبيق
      try {
        localStorage.setItem(
          "knoux-app-state",
          JSON.stringify({
            timestamp: Date.now(),
            url: window.location.pathname,
          }),
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
              {/* صفحة اختبار للتأكد من عمل التطبيق */}
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <TestPage />
                  </ErrorBoundary>
                }
              />

              {/* الصفحة المبسطة الآمنة */}
              <Route
                path="/simple"
                element={
                  <ErrorBoundary>
                    <SimplePage />
                  </ErrorBoundary>
                }
              />

              {/* الصفحة الرئيسية المتطورة - Ultimate Experience */}
              <Route
                path="/ultimate"
                element={
                  <ErrorBoundary>
                    <UltimatePage />
                  </ErrorBoundary>
                }
              />

              {/* محرك الذكاء الاصطناعي المتقدم مع 10 قدرات */}
              <Route
                path="/organizer"
                element={
                  <ErrorBoundary>
                    <OrganizerPage />
                  </ErrorBoundary>
                }
              />

              {/* التطبيق القوي السابق */}
              <Route
                path="/powerful"
                element={
                  <ErrorBoundary>
                    <PowerfulWorkingApp />
                  </ErrorBoundary>
                }
              />

              {/* التطبيق القديم للمقارنة */}
              <Route
                path="/legacy"
                element={
                  <ErrorBoundary>
                    <WorkingApp />
                  </ErrorBoundary>
                }
              />

              {/* أداة حذف التكرارات الذكية */}
              <Route
                path="/remove-duplicate"
                element={
                  <ErrorBoundary>
                    <RemoveDuplicatePage />
                  </ErrorBoundary>
                }
              />

              {/* أداة حذف التكرارات المتطورة بالذكاء الاصطناعي */}
              <Route
                path="/remove-duplicate-pro"
                element={<RemoveDuplicatePageEnhanced />}
              />
              <Route path="/live-preview-demo" element={<LivePreviewDemo />} />
              <Route path="/example-usage" element={<ExampleUsage />} />
              <Route path="/ai-analysis" element={<AIAnalysisPage />} />

              {/* صفحات إضافية للتطبيق المحمول */}
              <Route
                path="/quick-analysis"
                element={
                  <ErrorBoundary>
                    <UltimatePage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/smart-groups"
                element={
                  <ErrorBoundary>
                    <UltimatePage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/settings"
                element={
                  <ErrorBoundary>
                    <UltimatePage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/handle-image"
                element={
                  <ErrorBoundary>
                    <UltimatePage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/share-images"
                element={
                  <ErrorBoundary>
                    <UltimatePage />
                  </ErrorBoundary>
                }
              />

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
