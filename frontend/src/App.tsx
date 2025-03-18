import { Route, Routes } from "react-router";
import { DashboardPage, SurvivorPage } from "@/pages";
import { DashboardPageUrl, SurvivorPageUrl, TradePageUrl } from "@/pages/urls";
import { Toaster } from "@/components/ui/sonner";
import TradePage from "./pages/trade-page/TradePage";

function App() {
  return (
    <div className="h-svh px-16">
      <Routes>
        <Route path={DashboardPageUrl} element={<DashboardPage />} />
        <Route path={SurvivorPageUrl} element={<SurvivorPage />} />
        <Route path={TradePageUrl} element={<TradePage />} />
        <Route path={"*"} element={<NotFound />} />
      </Routes>
      <Toaster position="bottom-center" />
    </div>
  );
}

const NotFound = () => {
  return <p>Not Found</p>;
};

export default App;
