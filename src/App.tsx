import { AppProvider, useApp } from './lib/context';
import { Toaster } from './components/ui/sonner';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { DashboardAgent } from './components/DashboardAgent';
import { DashboardChef } from './components/DashboardChef';
import { DashboardOperations } from './components/DashboardOperations';
import { DashboardDG } from './components/DashboardDG';
import { DashboardDSI } from './components/DashboardDSI';

function AppContent() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  const DashboardComponent = {
    AGENT: DashboardAgent,
    CHEF_AGENCE: DashboardChef,
    OPERATIONS: DashboardOperations,
    DG: DashboardDG,
    DSI: DashboardDSI
  }[currentUser.role];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <DashboardComponent />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster />
    </AppProvider>
  );
}
