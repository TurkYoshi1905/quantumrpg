import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { GameProvider } from './store/gameStore';

import MainMenu from './pages/MainMenu';
import WorldMap from './pages/WorldMap';
import RegionPage from './pages/RegionPage';
import BattlePage from './pages/BattlePage';
import ShopPage from './pages/ShopPage';
import CharacterPage from './pages/CharacterPage';
import ChangelogPage from './pages/ChangelogPage';
import QuestsPage from './pages/QuestsPage';
import { LevelUpModal } from './components/LevelUpModal';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainMenu} />
      <Route path="/harita" component={WorldMap} />
      <Route path="/bolge/:regionId" component={RegionPage} />
      <Route path="/savas/:enemyId" component={BattlePage} />
      <Route path="/dukkan" component={ShopPage} />
      <Route path="/karakter" component={CharacterPage} />
      <Route path="/degisiklikler" component={ChangelogPage} />
      <Route path="/gorevler" component={QuestsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <div className="dark text-foreground min-h-[100dvh] bg-background">
              <Router />
              <LevelUpModal />
            </div>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App;
