import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { StationDetailPage } from "@/pages/StationDetailPage";
import { StationListPage } from "@/pages/StationListPage";

/**
 * 应用根组件，配置 React Router 路由
 */
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<StationListPage />} />
            <Route path="/station/:id" element={<StationDetailPage />} />
          </Routes>
        </main>
        <footer className="border-t border-radio-brass/20 py-4 text-center text-xs text-muted-foreground">
          短波台站 Mock 参考表 · 数据仅供学习参考 · 无真实电台流
        </footer>
      </div>
    </BrowserRouter>
  );
}
