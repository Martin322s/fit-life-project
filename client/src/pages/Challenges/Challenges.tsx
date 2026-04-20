import { useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import ProductStatCard from "../Products/sections/ProductStatCard";
import ChallengesHeader from "./sections/ChallengesHeader";
import ActiveChallengesCard from "./sections/ActiveChallengesCard";
import LeaderboardCard from "./sections/LeaderboardCard";
import UpcomingChallengesCard from "./sections/UpcomingChallengesCard";
import { CHALLENGE_STATS } from "./sections/challengesData";

type ChallengesProps = { theme: "dark" | "light"; onToggleTheme: () => void };

const CG_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.cg-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.cg-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; overflow-x: hidden; }
.cg-content { padding: var(--sp-5) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-4); }
.cg-header { padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); background: var(--c-surface-1,#0E1318); }
.cg-header-right { display: flex; align-items: center; gap: var(--sp-3); flex-shrink: 0; }
.cg-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: var(--c-bg,#080C10); flex-shrink: 0; }
.cg-hamburger { display: none; }
.cg-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--color-cream); line-height: 1.15; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cg-header-sub { margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-transform: capitalize; }
.cg-action-btn { display: flex; align-items: center; gap: var(--sp-2); padding: 8px 14px; border-radius: var(--r-md); background: rgba(0,102,255,0.1); border: 1px solid rgba(0,102,255,0.25); color: var(--c-electric,#0066FF); font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; }
.cg-action-btn:hover { background: rgba(0,102,255,0.18); }
.cg-top-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--sp-3); }
.cg-main-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: var(--sp-4); align-items: start; }
.cg-bottom-grid { display: grid; grid-template-columns: 1fr; gap: var(--sp-4); align-items: start; }
.cg-card { padding: var(--sp-5); box-sizing: border-box; min-width: 0; }
.cg-pill { padding: 5px 10px; border-radius: 999px; font-size: 0.72rem; letter-spacing: 0.03em; font-weight: 700; }
.cg-challenge-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sp-3); }
.cg-challenge-card { min-width: 0; }
@media (max-width: 1380px) {
  .cg-top-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cg-main-grid { grid-template-columns: 1fr; }
  .cg-challenge-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .dash-sidebar {
    position: fixed; left: 0; top: 0; bottom: 0; height: 100%;
    z-index: 300; transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
  }
  .dash-sidebar.dash-sidebar--open {
    transform: translateX(0);
    box-shadow: 8px 0 48px rgba(0,0,0,0.85);
  }
  .dash-sidebar-close { display: flex !important; }
  .cg-hamburger {
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 8px 10px; cursor: pointer;
    color: var(--color-cream); flex-shrink: 0;
  }
  .cg-header { padding: var(--sp-3) var(--sp-4); }
  .cg-content { padding: var(--sp-3) var(--sp-4); }
  .cg-title { font-size: 1rem !important; }
  .cg-header-sub { display: none; }
  .cg-avatar { display: none; }
  .cg-action-btn span { display: none; }
  .cg-top-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 480px) {
  .cg-top-grid { grid-template-columns: 1fr; }
  .cg-card { padding: var(--sp-4); }
}
`;

function Challenges({ theme, onToggleTheme }: ChallengesProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notice, setNotice] = useState("");

    return (
        <>
            <style>{CG_CSS}</style>
            {isSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="cg-page">
                <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="cg-main">
                    <ChallengesHeader onToggleSidebar={() => setIsSidebarOpen((open) => !open)} onCreateChallenge={() => setNotice("Custom challenge creator е подготвен client-side. След бекенда ще пазим реални правила, участници и прогрес.")} />

                    <div className="cg-content">
                        {notice && (
                            <div className="card cg-card" style={{ padding: "14px 16px", background: "rgba(0,102,255,0.08)", border: "1px solid rgba(0,102,255,0.18)", color: "var(--color-cream)" }}>
                                {notice}
                            </div>
                        )}
                        <div className="cg-top-grid">
                            <ProductStatCard label="Live challenges" value={String(CHALLENGE_STATS.liveNow)} sub="активни предизвикателства в момента" accent="join now" accentColor="var(--c-acid,#C8FF00)" />
                            <ProductStatCard label="Участници" value={CHALLENGE_STATS.participants} sub="включени тази седмица" accent="community" accentColor="var(--c-electric,#0066FF)" />
                            <ProductStatCard label="Отключени награди" value={String(CHALLENGE_STATS.rewardsUnlocked)} sub="badge, XP и бонуси" accent="earned" accentColor="rgba(255,255,255,0.45)" />
                            <ProductStatCard label="Най-добър streak" value={`${CHALLENGE_STATS.bestStreak} дни`} sub="водеща серия в leaderboard-а" accent="peak" accentColor="var(--c-acid,#C8FF00)" />
                        </div>

                        <div className="cg-main-grid">
                            <ActiveChallengesCard />
                            <LeaderboardCard />
                        </div>

                        <div className="cg-bottom-grid">
                            <UpcomingChallengesCard />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Challenges;
