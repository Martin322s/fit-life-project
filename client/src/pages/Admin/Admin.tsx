import { useCallback, useEffect, useState } from "react";
import type { JSX } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import { useAuth } from "../../context/AuthContext";
import { adminApi, type AdminUser, type AdminStats } from "../../services/adminApi";

type Props = { theme: "dark" | "light"; onToggleTheme: () => void };

const ADM_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.adm-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.adm-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; }
.adm-header { padding: 18px 24px; border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); display: flex; justify-content: space-between; align-items: center; background: var(--c-surface-1,#0E1318); gap: 12px; }
.adm-content { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.adm-stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
.adm-stat { padding: 16px 18px; border-radius: 12px; background: var(--c-surface-1,#0E1318); border: 1px solid var(--c-border,rgba(255,255,255,0.06)); }
.adm-hamburger { display: none; }
.adm-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.adm-table th { text-align: left; padding: 10px 12px; background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.45); font-weight: 600; font-size: 0.75rem; letter-spacing: 0.04em; text-transform: uppercase; border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); }
.adm-table td { padding: 10px 12px; border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); vertical-align: middle; color: var(--color-cream); }
.adm-table tr:last-child td { border-bottom: none; }
.adm-role-badge { display: inline-flex; padding: 2px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; }
.adm-role-admin { background: rgba(200,255,0,0.12); color: #C8FF00; border: 1px solid rgba(200,255,0,0.25); }
.adm-role-user  { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.55); border: 1px solid rgba(255,255,255,0.1); }
@media (max-width: 900px) { .adm-stats-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 768px) {
  .dash-sidebar { position: fixed; left: 0; top: 0; bottom: 0; height: 100%; z-index: 300; transform: translateX(-100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }
  .dash-sidebar.dash-sidebar--open { transform: translateX(0); box-shadow: 8px 0 48px rgba(0,0,0,0.85); }
  .dash-sidebar-close { display: flex !important; }
  .adm-hamburger { display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 10px; cursor: pointer; color: var(--color-cream); flex-shrink: 0; }
  .adm-content { padding: 16px; }
}
`;

export default function Admin({ theme, onToggleTheme }: Props): JSX.Element {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [u, s] = await Promise.all([adminApi.getUsers(), adminApi.getStats()]);
      setUsers(u.items);
      setStats(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Грешка при зареждане.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRoleToggle = async (u: AdminUser) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    try {
      await adminApi.patchUserRole(u.id, newRole);
      setActionMsg(`Ролята на ${u.firstName} е сменена на ${newRole}.`);
      setTimeout(() => setActionMsg(""), 4000);
      load();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Грешка.");
    }
  };

  const handleDelete = async (u: AdminUser) => {
    if (!window.confirm(`Изтриване на акаунт "${u.email}"? Действието е необратимо.`)) return;
    try {
      await adminApi.deleteUser(u.id);
      setActionMsg(`Акаунтът ${u.email} е изтрит.`);
      setTimeout(() => setActionMsg(""), 4000);
      load();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Грешка при изтриване.");
    }
  };

  const initials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : "?";

  return (
    <>
      <style>{ADM_CSS}</style>
      {isSidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", cursor: "pointer" }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="adm-page">
        <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="adm-main">
          <div className="adm-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="adm-hamburger" type="button" onClick={() => setIsSidebarOpen(o => !o)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, color: "var(--color-cream)" }}>
                  Административен панел
                </div>
                <div className="label text-gray">Управление на потребители и статистики</div>
              </div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 700,
              color: "var(--c-bg,#080C10)", overflow: "hidden",
            }}>
              {user?.avatarDataUrl
                ? <img src={user.avatarDataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : initials}
            </div>
          </div>

          <div className="adm-content">
            {error && (
              <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,61,87,0.08)", border: "1px solid rgba(255,61,87,0.25)", color: "var(--color-cream)" }}>
                {error}
              </div>
            )}
            {actionMsg && (
              <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(0,180,90,0.08)", border: "1px solid rgba(0,180,90,0.25)", color: "var(--color-cream)" }}>
                {actionMsg}
              </div>
            )}

            {/* Stats */}
            {stats && (
              <>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--color-cream)" }}>
                  Статистики
                </div>
                <div className="adm-stats-grid">
                  <StatCard label="Потребители" value={stats.users.total} sub={`+${stats.users.new30d} за 30 дни`} color="#C8FF00" />
                  <StatCard label="Хранения"    value={stats.meals}           color="#0099FF" />
                  <StatCard label="Тренировки"  value={stats.workouts}        color="#8B5CF6" />
                  <StatCard label="Прогрес"     value={stats.progressEntries} color="#F59E0B" />
                  <StatCard label="Рецепти"     value={stats.content.recipes}       color="#22C55E" />
                  <StatCard label="Диети"       value={stats.content.diets}         color="#06B6D4" />
                  <StatCard label="Програми"    value={stats.content.trainingPlans} color="#F97316" />
                  <StatCard label="Предизв."    value={stats.content.userChallenges} sub={`от ${stats.content.challenges} глобални`} color="#EF4444" />
                </div>
              </>
            )}

            {/* Users table */}
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--color-cream)" }}>
              Потребители ({users.length})
            </div>
            {loading ? (
              <div className="label text-gray" style={{ padding: 24, textAlign: "center" }}>Зареждане…</div>
            ) : users.length === 0 ? (
              <div className="label text-gray" style={{ padding: 24, textAlign: "center" }}>Няма потребители.</div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Потребител</th>
                        <th>Email</th>
                        <th>Роля</th>
                        <th>Регистрация</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</td>
                          <td style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>{u.email}</td>
                          <td>
                            <span className={`adm-role-badge ${u.role === "admin" ? "adm-role-admin" : "adm-role-user"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>
                            {new Date(u.createdAt).toLocaleDateString("bg-BG")}
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 8 }}>
                              {u.id !== user?.id && (
                                <button
                                  type="button"
                                  className="btn-ghost btn-sm"
                                  style={{ fontSize: "0.72rem", padding: "4px 10px" }}
                                  onClick={() => handleRoleToggle(u)}
                                >
                                  {u.role === "admin" ? "→ user" : "→ admin"}
                                </button>
                              )}
                              {u.id !== user?.id && (
                                <button
                                  type="button"
                                  className="btn-ghost btn-sm"
                                  style={{ fontSize: "0.72rem", padding: "4px 10px", color: "var(--c-error,#FF3D57)", borderColor: "rgba(255,61,87,0.25)" }}
                                  onClick={() => handleDelete(u)}
                                >
                                  Изтрий
                                </button>
                              )}
                              {u.id === user?.id && <span className="label text-gray">Ти</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }): JSX.Element {
  return (
    <div className="adm-stat">
      <div className="label text-gray" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color, lineHeight: 1, marginBottom: 4 }}>
        {value.toLocaleString("bg-BG")}
      </div>
      {sub && <div className="label text-gray">{sub}</div>}
    </div>
  );
}
