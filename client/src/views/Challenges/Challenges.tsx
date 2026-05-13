"use client";

import { useMemo, useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { getInitials, useAuth } from "../../context/AuthContext";
import { useChallengesData } from "../../hooks/useChallengesData";
import type {
  ApiChallenge,
  ApiUserChallenge,
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeTargetType,
} from "../../services/challengesApi";
import ProductStatCard from "../Products/sections/ProductStatCard";
import ChallengesHeader from "./sections/ChallengesHeader";

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
.cg-controls { display: grid; grid-template-columns: 1.2fr repeat(3, minmax(0, 1fr)); gap: var(--sp-2); }
.cg-input, .cg-select {
  width: 100%; border-radius: var(--r-md); padding: 10px 12px; font-size: 0.88rem;
  background: rgba(255,255,255,0.03); color: var(--color-cream); border: 1px solid rgba(255,255,255,0.08);
}
.cg-challenge-list { display: grid; gap: var(--sp-3); }
.cg-row { border-radius: var(--r-lg); border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); padding: 14px; display: grid; gap: var(--sp-2); }
.cg-row-top { display: flex; justify-content: space-between; gap: var(--sp-2); align-items: flex-start; }
.cg-row-meta { display: flex; gap: 8px; flex-wrap: wrap; }
.cg-row-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.cg-progress-track { height: 8px; border-radius: 999px; background: rgba(255,255,255,0.09); overflow: hidden; }
.cg-progress-fill { height: 100%; border-radius: 999px; background: linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00)); }
.cg-modal-backdrop { position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,0.72); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 16px; }
.cg-modal { width: min(760px, 100%); max-height: 90vh; overflow: auto; border-radius: var(--r-xl); background: var(--c-surface-1,#0E1318); border: 1px solid rgba(255,255,255,0.08); padding: var(--sp-5); display: grid; gap: var(--sp-4); }
@media (max-width: 1380px) {
  .cg-top-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cg-main-grid { grid-template-columns: 1fr; }
  .cg-controls { grid-template-columns: 1fr 1fr; }
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
  .cg-controls { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .cg-top-grid { grid-template-columns: 1fr; }
  .cg-card { padding: var(--sp-4); }
}
`;

const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  fitness: "Фитнес",
  nutrition: "Хранене",
  hydration: "Хидратация",
  "weight loss": "Отслабване",
  habits: "Навици",
  beginner: "Начинаещи",
  consistency: "Постоянство",
};

const DIFFICULTY_LABELS: Record<ChallengeDifficulty, string> = {
  easy: "Лесно",
  medium: "Средно",
  hard: "Трудно",
};

const TARGET_LABELS: Record<ChallengeTargetType, string> = {
  steps: "Крачки",
  workouts: "Тренировки",
  weight_loss: "Свалени кг",
  calories_burned: "Изгорени kcal",
  water: "Вода",
  consistency: "Постоянство",
  custom: "Персонална цел",
};

const STATUS_LABELS: Record<ApiUserChallenge["status"], string> = {
  active: "Активно",
  completed: "Завършено",
  abandoned: "Прекратено",
};

function DetailsModal({
  challenge,
  joined,
  progressDraft,
  onClose,
  onJoin,
  onSetProgressDraft,
  onSaveProgress,
  onAbandon,
}: {
  challenge: ApiChallenge;
  joined: ApiUserChallenge | null;
  progressDraft: string;
  onClose: () => void;
  onJoin: () => void;
  onSetProgressDraft: (value: string) => void;
  onSaveProgress: () => void;
  onAbandon: () => void;
}): JSX.Element {
  const progressValue = joined?.progressValue ?? 0;
  const progressPercent = Math.max(0, Math.min(100, (progressValue / challenge.targetValue) * 100));

  return (
    <div className="cg-modal-backdrop" onClick={onClose}>
      <div className="cg-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-3)", alignItems: "flex-start" }}>
          <div>
            <div className="label text-gray">Детайли</div>
            <h2 style={{ margin: "6px 0 0", color: "var(--color-cream)", fontFamily: "var(--font-display)", fontSize: "1.45rem", lineHeight: 1.15 }}>{challenge.title}</h2>
          </div>
          <button type="button" className="btn-ghost btn-sm" onClick={onClose}>Затвори</button>
        </div>

        <div className="cg-row-meta">
          <span className="cg-pill" style={{ background: "rgba(0,102,255,0.12)", color: "var(--c-electric,#0066FF)" }}>{CATEGORY_LABELS[challenge.category]}</span>
          <span className="cg-pill" style={{ background: "rgba(255,255,255,0.08)", color: "var(--color-cream)" }}>{DIFFICULTY_LABELS[challenge.difficulty]}</span>
          <span className="cg-pill" style={{ background: "rgba(200,255,0,0.1)", color: "var(--c-acid,#C8FF00)" }}>{challenge.durationDays} дни</span>
        </div>

        <p className="body-sm" style={{ margin: 0, color: "var(--color-cream)", lineHeight: 1.7 }}>{challenge.description}</p>

        <div style={{ display: "grid", gap: "var(--sp-2)" }}>
          <div className="label text-gray">Цел</div>
          <div className="body-sm" style={{ color: "var(--color-cream)" }}>{TARGET_LABELS[challenge.targetType]}: {challenge.targetValue} {challenge.targetUnit}</div>
          <div className="body-sm" style={{ color: "var(--color-cream)" }}>Награда: {challenge.rewardText ?? "Няма зададена награда"}</div>
        </div>

        <div style={{ display: "grid", gap: "var(--sp-2)" }}>
          <div className="label text-gray">Правила</div>
          <div style={{ display: "grid", gap: "var(--sp-2)" }}>
            {challenge.rules.map((rule, index) => (
              <div key={rule + index} className="body-sm" style={{ color: "var(--color-cream)" }}>• {rule}</div>
            ))}
          </div>
        </div>

        {joined ? (
          <>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span className="label text-gray">Статус: {STATUS_LABELS[joined.status]}</span>
                <span className="label" style={{ color: "var(--color-cream)" }}>{progressValue.toFixed(0)} / {challenge.targetValue} {challenge.targetUnit}</span>
              </div>
              <div className="cg-progress-track">
                <div className="cg-progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="number"
                className="cg-input"
                style={{ maxWidth: 220 }}
                min={0}
                value={progressDraft}
                onChange={(e) => onSetProgressDraft(e.target.value)}
                placeholder="Нов прогрес"
              />
              <button type="button" className="btn-primary" onClick={onSaveProgress}>Запази прогрес</button>
              {joined.status !== "completed" && (
                <button type="button" className="btn-ghost btn-sm" onClick={onAbandon}>Прекрати участие</button>
              )}
            </div>
          </>
        ) : (
          <div>
            <div className="body-sm text-gray" style={{ marginBottom: 10 }}>Все още не участваш в това предизвикателство.</div>
            <button type="button" className="btn-primary" onClick={onJoin}>Включи се</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Challenges(): JSX.Element {
  const { user } = useAuth();
  const data = useChallengesData(user?.id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ApiChallenge | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [progressDrafts, setProgressDrafts] = useState<Record<string, string>>({});

  const initials = user ? getInitials(user) : "FL";
  const joinedActive = data.userItems.filter((item) => item.status === "active");
  const joinedCompleted = data.userItems.filter((item) => item.status === "completed");

  const selectedJoined = useMemo(
    () => (selectedChallenge ? data.joinedByChallengeId.get(selectedChallenge.id) ?? null : null),
    [selectedChallenge, data.joinedByChallengeId],
  );

  const selectedProgressDraft = selectedJoined
    ? progressDrafts[selectedJoined.id] ?? String(Math.round(selectedJoined.progressValue))
    : "";

  const safeAction = async (action: () => Promise<void>) => {
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Операцията не беше успешна.");
    }
  };

  const openDetails = (challenge: ApiChallenge) => {
    setSelectedChallenge(challenge);
    const joined = data.joinedByChallengeId.get(challenge.id);
    if (joined) {
      setProgressDrafts((current) => ({ ...current, [joined.id]: String(Math.round(joined.progressValue)) }));
    }
  };

  const setDraft = (userChallengeId: string, value: string) => {
    setProgressDrafts((current) => ({ ...current, [userChallengeId]: value }));
  };

  const renderStatusPill = (status: ApiUserChallenge["status"]) => {
    const style =
      status === "completed"
        ? { background: "rgba(0,230,118,0.16)", color: "#00E676" }
        : status === "abandoned"
          ? { background: "rgba(255,61,87,0.16)", color: "#FF3D57" }
          : { background: "rgba(0,102,255,0.16)", color: "var(--c-electric,#0066FF)" };

    return <span className="cg-pill" style={style}>{STATUS_LABELS[status]}</span>;
  };

  return (
    <>
      <style>{CG_CSS}</style>
      {selectedChallenge && (
        <DetailsModal
          challenge={selectedChallenge}
          joined={selectedJoined}
          progressDraft={selectedProgressDraft}
          onClose={() => setSelectedChallenge(null)}
          onJoin={() => safeAction(async () => {
            await data.joinChallenge(selectedChallenge.id);
          })}
          onSetProgressDraft={(value) => {
            if (!selectedJoined) return;
            setDraft(selectedJoined.id, value);
          }}
          onSaveProgress={() => {
            if (!selectedJoined) return;
            const parsed = Number(progressDrafts[selectedJoined.id] ?? selectedJoined.progressValue);
            safeAction(async () => {
              await data.updateProgress(selectedJoined.id, Number.isFinite(parsed) ? parsed : selectedJoined.progressValue);
            });
          }}
          onAbandon={() => {
            if (!selectedJoined) return;
            safeAction(async () => {
              await data.abandonChallenge(selectedJoined.id);
              setSelectedChallenge(null);
            });
          }}
        />
      )}

      {isSidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="cg-page">
        <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="cg-main">
          <ChallengesHeader
            onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
            onRefresh={data.refresh}
            liveNow={joinedActive.length}
            initials={initials}
          />

          <div className="cg-content">
            {(data.error || data.userError || actionError) && (
              <div style={{ padding: "var(--sp-3) var(--sp-4)", borderRadius: "var(--r-md)", background: "rgba(255,61,87,0.1)", border: "1px solid rgba(255,61,87,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--sp-3)" }}>
                <span className="body-sm" style={{ color: "var(--c-error,#FF3D57)" }}>Грешка: {data.error ?? data.userError ?? actionError}</span>
                <button type="button" className="btn-ghost btn-sm" onClick={data.refresh}>Опитай отново</button>
              </div>
            )}

            <div className="cg-top-grid">
              <ProductStatCard label="Глобални предизвикателства" value={data.isLoading ? "—" : String(data.total)} sub="достъпни за всички" accent={`${data.limit}/стр.`} accentColor="var(--c-electric,#0066FF)" />
              <ProductStatCard label="Активни участия" value={String(joinedActive.length)} sub="твоят текущ прогрес" accent="active" accentColor="var(--c-acid,#C8FF00)" />
              <ProductStatCard label="Завършени" value={String(joinedCompleted.length)} sub="успешно приключени" accent="done" accentColor="#00E676" />
              <ProductStatCard label="Страница" value={`${data.page}/${data.totalPages}`} sub="пагинация" accent="→" accentColor="rgba(255,255,255,0.45)" />
            </div>

            <div className="cg-main-grid">
              <div className="card cg-card" style={{ display: "grid", gap: "var(--sp-4)" }}>
                <div>
                  <div className="label text-gray">Каталог</div>
                  <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Глобални предизвикателства</div>
                </div>

                <div className="cg-controls">
                  <input className="cg-input" placeholder="Търси по име или описание" value={data.search} onChange={(e) => data.setSearch(e.target.value)} />
                  <select className="cg-select" value={data.category} onChange={(e) => data.setCategory(e.target.value as ChallengeCategory | "") }>
                    <option value="">Всички категории</option>
                    <option value="fitness">Фитнес</option>
                    <option value="nutrition">Хранене</option>
                    <option value="hydration">Хидратация</option>
                    <option value="weight loss">Отслабване</option>
                    <option value="habits">Навици</option>
                    <option value="beginner">Начинаещи</option>
                    <option value="consistency">Постоянство</option>
                  </select>
                  <select className="cg-select" value={data.difficulty} onChange={(e) => data.setDifficulty(e.target.value as ChallengeDifficulty | "") }>
                    <option value="">Всички нива</option>
                    <option value="easy">Лесно</option>
                    <option value="medium">Средно</option>
                    <option value="hard">Трудно</option>
                  </select>
                  <select className="cg-select" value={data.targetType} onChange={(e) => data.setTargetType(e.target.value as ChallengeTargetType | "") }>
                    <option value="">Всички цели</option>
                    <option value="steps">Крачки</option>
                    <option value="workouts">Тренировки</option>
                    <option value="weight_loss">Свалени кг</option>
                    <option value="calories_burned">Изгорени kcal</option>
                    <option value="water">Вода</option>
                    <option value="consistency">Постоянство</option>
                    <option value="custom">Персонална</option>
                  </select>
                </div>

                {data.isLoading ? (
                  <div className="body-sm text-gray">Зареждане на предизвикателствата...</div>
                ) : data.items.length === 0 ? (
                  <div className="body-sm text-gray">Няма резултати за избраните филтри.</div>
                ) : (
                  <div className="cg-challenge-list">
                    {data.items.map((challenge) => {
                      const joined = data.joinedByChallengeId.get(challenge.id) ?? null;
                      const progressValue = joined?.progressValue ?? 0;
                      const progressPercent = Math.max(0, Math.min(100, (progressValue / challenge.targetValue) * 100));

                      return (
                        <div key={challenge.id} className="cg-row">
                          <div className="cg-row-top">
                            <div>
                              <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 800 }}>{challenge.title}</div>
                              <div className="label text-gray" style={{ marginTop: 4 }}>{challenge.durationDays} дни · {TARGET_LABELS[challenge.targetType]}: {challenge.targetValue} {challenge.targetUnit}</div>
                            </div>
                            {joined ? renderStatusPill(joined.status) : <span className="cg-pill" style={{ background: "rgba(255,255,255,0.08)", color: "var(--color-cream)" }}>Невключен</span>}
                          </div>

                          <div className="cg-row-meta">
                            <span className="cg-pill" style={{ background: "rgba(0,102,255,0.12)", color: "var(--c-electric,#0066FF)" }}>{CATEGORY_LABELS[challenge.category]}</span>
                            <span className="cg-pill" style={{ background: "rgba(255,255,255,0.08)", color: "var(--color-cream)" }}>{DIFFICULTY_LABELS[challenge.difficulty]}</span>
                          </div>

                          {joined && (
                            <>
                              <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--sp-2)", alignItems: "center" }}>
                                <span className="label text-gray">Прогрес</span>
                                <span className="label" style={{ color: "var(--color-cream)" }}>{progressValue.toFixed(0)} / {challenge.targetValue} {challenge.targetUnit}</span>
                              </div>
                              <div className="cg-progress-track"><div className="cg-progress-fill" style={{ width: `${progressPercent}%` }} /></div>
                            </>
                          )}

                          <div className="cg-row-actions">
                            <button type="button" className="btn-ghost btn-sm" onClick={() => openDetails(challenge)}>Детайли</button>
                            {!joined && (
                              <button
                                type="button"
                                className="btn-primary"
                                onClick={() => safeAction(async () => {
                                  await data.joinChallenge(challenge.id);
                                })}
                              >
                                Включи се
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--sp-3)", flexWrap: "wrap" }}>
                  <div className="label text-gray">Общо: {data.total}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" className="btn-ghost btn-sm" onClick={() => data.setPage(data.page - 1)} disabled={data.page <= 1}>Назад</button>
                    <button type="button" className="btn-ghost btn-sm" onClick={() => data.setPage(data.page + 1)} disabled={data.page >= data.totalPages}>Напред</button>
                  </div>
                </div>
              </div>

              <div className="card cg-card" style={{ display: "grid", gap: "var(--sp-4)" }}>
                <div>
                  <div className="label text-gray">Моите участия</div>
                  <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Активни предизвикателства</div>
                </div>

                {data.isUserLoading ? (
                  <div className="body-sm text-gray">Зареждане на участията...</div>
                ) : joinedActive.length === 0 ? (
                  <div className="body-sm text-gray">Все още нямаш активни предизвикателства.</div>
                ) : (
                  <div className="cg-challenge-list">
                    {joinedActive.map((entry) => {
                      const progressPercent = Math.max(0, Math.min(100, (entry.progressValue / entry.challenge.targetValue) * 100));
                      const draftValue = progressDrafts[entry.id] ?? String(Math.round(entry.progressValue));

                      return (
                        <div key={entry.id} className="cg-row">
                          <div className="cg-row-top">
                            <div>
                              <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{entry.challenge.title}</div>
                              <div className="label text-gray" style={{ marginTop: 4 }}>
                                {entry.progressValue.toFixed(0)} / {entry.challenge.targetValue} {entry.challenge.targetUnit}
                              </div>
                            </div>
                            {renderStatusPill(entry.status)}
                          </div>

                          <div className="cg-progress-track"><div className="cg-progress-fill" style={{ width: `${progressPercent}%` }} /></div>

                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <input
                              type="number"
                              min={0}
                              className="cg-input"
                              style={{ maxWidth: 160 }}
                              value={draftValue}
                              onChange={(e) => setDraft(entry.id, e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => {
                                const parsed = Number(progressDrafts[entry.id] ?? entry.progressValue);
                                safeAction(async () => {
                                  await data.updateProgress(entry.id, Number.isFinite(parsed) ? parsed : entry.progressValue);
                                });
                              }}
                            >
                              Обнови прогрес
                            </button>
                            <button
                              type="button"
                              className="btn-ghost btn-sm"
                              onClick={() => safeAction(async () => {
                                await data.abandonChallenge(entry.id);
                              })}
                            >
                              Премахни
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="cg-bottom-grid">
              <div className="card cg-card" style={{ display: "grid", gap: "var(--sp-4)" }}>
                <div>
                  <div className="label text-gray">История</div>
                  <div className="heading-sm" style={{ color: "var(--color-cream)", marginTop: 4 }}>Завършени предизвикателства</div>
                </div>

                {joinedCompleted.length === 0 ? (
                  <div className="body-sm text-gray">Няма завършени предизвикателства за този профил.</div>
                ) : (
                  <div className="cg-challenge-list">
                    {joinedCompleted.map((entry) => (
                      <div key={entry.id} className="cg-row">
                        <div className="cg-row-top">
                          <div>
                            <div className="body-sm" style={{ color: "var(--color-cream)", fontWeight: 700 }}>{entry.challenge.title}</div>
                            <div className="label text-gray" style={{ marginTop: 4 }}>
                              Финален прогрес: {entry.progressValue.toFixed(0)} / {entry.challenge.targetValue} {entry.challenge.targetUnit}
                            </div>
                          </div>
                          {renderStatusPill(entry.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Challenges;


