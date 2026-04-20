import { useState } from "react";
import type { JSX, ReactNode } from "react";
import DashboardSidebar from "../../layout/DashboardLayout/DashboardSidebar";
import ProductStatCard from "../Products/sections/ProductStatCard";
import CalculatorsHeader from "./sections/CalculatorsHeader";

type CalculatorsProps = { theme: "dark" | "light"; onToggleTheme: () => void };
type Sex = "male" | "female";
type Goal = "cut" | "maintain" | "gain";
type Activity = "sedentary" | "light" | "moderate" | "active" | "very_active";
type CalculatorTab = "calories" | "macros" | "bmi" | "bodyfat" | "leanmass" | "water" | "protein" | "pace" | "onerm" | "steps";

const TAB_OPTIONS: { key: CalculatorTab; label: string; icon: string }[] = [
    { key: "calories", label: "Calories", icon: "🔥" },
    { key: "macros", label: "Macros", icon: "🥗" },
    { key: "bmi", label: "BMI", icon: "⚖️" },
    { key: "bodyfat", label: "Body Fat", icon: "📏" },
    { key: "leanmass", label: "Lean Mass", icon: "💪" },
    { key: "water", label: "Water", icon: "💧" },
    { key: "protein", label: "Protein", icon: "🥩" },
    { key: "pace", label: "Pace", icon: "🏃" },
    { key: "onerm", label: "1RM", icon: "🏋️" },
    { key: "steps", label: "Steps", icon: "👟" },
];

const ACTIVITY_MAP: Record<Activity, { label: string; factor: number }> = {
    sedentary: { label: "Заседнал", factor: 1.2 },
    light: { label: "Леко активен", factor: 1.375 },
    moderate: { label: "Умерено активен", factor: 1.55 },
    active: { label: "Много активен", factor: 1.725 },
    very_active: { label: "Екстремно активен", factor: 1.9 },
};

const GOAL_COPY: Record<Goal, { label: string; calories: number; protein: number; fat: number }> = {
    cut: { label: "Релеф", calories: -450, protein: 2.2, fat: 0.8 },
    maintain: { label: "Поддръжка", calories: 0, protein: 1.8, fat: 0.9 },
    gain: { label: "Покачване", calories: 300, protein: 2, fat: 0.9 },
};

const CX_CSS = `
.dash-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
.dash-sidebar-close { display: none !important; }
.cx-page { display: flex; min-height: 100vh; background: var(--c-bg,#080C10); overflow-x: clip; }
.cx-main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto; overflow-x: hidden; }
.cx-content { padding: var(--sp-5) var(--sp-6); display: flex; flex-direction: column; gap: var(--sp-4); }
.cx-header { padding: var(--sp-4) var(--sp-6); border-bottom: 1px solid var(--c-border,rgba(255,255,255,0.06)); display: flex; justify-content: space-between; align-items: center; gap: var(--sp-3); background: var(--c-surface-1,#0E1318); }
.cx-header-right { display: flex; align-items: center; gap: var(--sp-3); flex-shrink: 0; }
.cx-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--c-electric,#0066FF),var(--c-acid,#C8FF00)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: var(--c-bg,#080C10); flex-shrink: 0; }
.cx-badge { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: rgba(200,255,0,0.08); border: 1px solid rgba(200,255,0,0.18); color: var(--c-acid,#C8FF00); font-weight: 800; }
.cx-hamburger { display: none; }
.cx-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--color-cream); line-height: 1.15; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cx-header-sub { margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-transform: capitalize; }
.cx-top-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: var(--sp-3); }
.cx-tab-row { display: flex; gap: var(--sp-2); overflow-x: auto; padding-bottom: 2px; }
.cx-tab-btn { white-space: nowrap; padding: 9px 14px; border-radius: var(--r-full); font-size: 0.8rem; font-weight: 800; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); background: transparent; color: rgba(255,255,255,0.45); flex-shrink: 0; }
.cx-tab-btn--active { background: rgba(0,102,255,0.12); border-color: var(--c-electric,#0066FF); color: var(--c-electric,#0066FF); }
.cx-main-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: var(--sp-4); align-items: start; }
.cx-card { padding: var(--sp-5); box-sizing: border-box; min-width: 0; }
.cx-section-title { color: var(--color-cream); margin-top: 4px; }
.cx-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-3); }
.cx-field { display: flex; flex-direction: column; gap: 6px; }
.cx-input, .cx-select { width: 100%; box-sizing: border-box; border-radius: var(--r-md); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: var(--color-cream); padding: 11px 12px; outline: none; }
.cx-select { color-scheme: dark; }
[data-theme="light"] .cx-select { color-scheme: light; }
.cx-results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-3); }
.cx-result-box { padding: 14px; border-radius: var(--r-lg); background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); min-width: 0; }
.cx-helper-list { display: grid; gap: var(--sp-3); }
.cx-progress { height: 10px; border-radius: 999px; background: rgba(255,255,255,0.06); overflow: hidden; }
.cx-progress > div { height: 100%; border-radius: 999px; background: linear-gradient(90deg,var(--c-electric,#0066FF),#00C2FF); }
@media (max-width: 1250px) { .cx-top-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } .cx-main-grid { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .dash-sidebar { position: fixed; left: 0; top: 0; bottom: 0; height: 100%; z-index: 300; transform: translateX(-100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }
  .dash-sidebar.dash-sidebar--open { transform: translateX(0); box-shadow: 8px 0 48px rgba(0,0,0,0.85); }
  .dash-sidebar-close { display: flex !important; }
  .cx-hamburger { display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 10px; cursor: pointer; color: var(--color-cream); flex-shrink: 0; }
  .cx-header { padding: var(--sp-3) var(--sp-4); } .cx-content { padding: var(--sp-3) var(--sp-4); } .cx-title { font-size: 1rem !important; }
  .cx-header-sub, .cx-avatar { display: none; } .cx-top-grid, .cx-form-grid, .cx-results-grid { grid-template-columns: 1fr; } .cx-badge { padding: 8px 10px; }
}
@media (max-width: 480px) { .cx-top-grid { grid-template-columns: 1fr; } .cx-card { padding: var(--sp-4); } }
`;

function round(value: number, digits = 0): number {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function formatPace(minutes: number): string {
    const wholeMinutes = Math.floor(minutes);
    const seconds = Math.round((minutes - wholeMinutes) * 60);
    const correctedMinutes = seconds === 60 ? wholeMinutes + 1 : wholeMinutes;
    const correctedSeconds = seconds === 60 ? 0 : seconds;
    return `${correctedMinutes}:${String(correctedSeconds).padStart(2, "0")} /км`;
}

function NumberField({ label, value, onChange, suffix, min, max, step = "any" }: { label: string; value: number; onChange: (next: number) => void; suffix?: string; min?: number; max?: number; step?: number | "any" }): JSX.Element {
    return (
        <label className="cx-field">
            <span className="label text-gray">{label}</span>
            <div style={{ position: "relative" }}>
                <input className="cx-input" type="number" value={value} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))} style={{ paddingRight: suffix ? 44 : 12 }} />
                {suffix && <span className="label text-gray" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>{suffix}</span>}
            </div>
        </label>
    );
}

function SelectField<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (next: T) => void; options: { value: T; label: string }[] }): JSX.Element {
    return (
        <label className="cx-field">
            <span className="label text-gray">{label}</span>
            <select className="cx-select" value={value} onChange={(e) => onChange(e.target.value as T)}>
                {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </label>
    );
}

function ResultMetric({ label, value, hint, color }: { label: string; value: string; hint?: string; color?: string }): JSX.Element {
    return (
        <div className="cx-result-box">
            <div className="label text-gray">{label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 900, color: color ?? "var(--color-cream)", marginTop: 6, lineHeight: 1.1 }}>{value}</div>
            {hint && <div className="body-sm text-gray" style={{ marginTop: 8 }}>{hint}</div>}
        </div>
    );
}

function InsightCard({ title, children }: { title: string; children: ReactNode }): JSX.Element {
    return (
        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div><div className="label text-gray">Insight</div><div className="heading-sm cx-section-title">{title}</div></div>
            {children}
        </div>
    );
}

function Calculators({ theme, onToggleTheme }: CalculatorsProps): JSX.Element {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<CalculatorTab>("calories");
    const [sex, setSex] = useState<Sex>("male");
    const [age, setAge] = useState(29);
    const [height, setHeight] = useState(178);
    const [weight, setWeight] = useState(82);
    const [goal, setGoal] = useState<Goal>("maintain");
    const [activity, setActivity] = useState<Activity>("moderate");
    const [waist, setWaist] = useState(88);
    const [neck, setNeck] = useState(39);
    const [hip, setHip] = useState(98);
    const [trainingMinutes, setTrainingMinutes] = useState(60);
    const [sessionsPerWeek, setSessionsPerWeek] = useState(4);
    const [distanceKm, setDistanceKm] = useState(5);
    const [timeMinutes, setTimeMinutes] = useState(27);
    const [timeSeconds, setTimeSeconds] = useState(30);
    const [liftWeight, setLiftWeight] = useState(80);
    const [liftReps, setLiftReps] = useState(5);
    const [steps, setSteps] = useState(10000);

    const safeWeight = clamp(weight || 0, 1, 400);
    const safeHeight = clamp(height || 0, 80, 250);
    const safeAge = clamp(age || 0, 10, 100);
    const heightM = safeHeight / 100;
    const bmr = sex === "male" ? 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge + 5 : 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge - 161;
    const tdee = bmr * ACTIVITY_MAP[activity].factor;
    const targetCalories = tdee + GOAL_COPY[goal].calories;
    const proteinG = safeWeight * GOAL_COPY[goal].protein;
    const fatG = safeWeight * GOAL_COPY[goal].fat;
    const carbsG = Math.max((targetCalories - proteinG * 4 - fatG * 9) / 4, 0);
    const bmi = safeWeight / (heightM * heightM);
    const bmiCategory = bmi < 18.5 ? "Поднормено" : bmi < 25 ? "Нормално" : bmi < 30 ? "Наднормено" : "Затлъстяване";
    const navyBodyFat = sex === "male"
        ? 495 / (1.0324 - 0.19077 * Math.log10(Math.max(waist - neck, 1)) + 0.15456 * Math.log10(safeHeight)) - 450
        : 495 / (1.29579 - 0.35004 * Math.log10(Math.max(waist + hip - neck, 1)) + 0.221 * Math.log10(safeHeight)) - 450;
    const bodyFat = clamp(navyBodyFat, 3, 60);
    const leanMass = safeWeight * (1 - bodyFat / 100);
    const fatMass = safeWeight - leanMass;
    const ffmi = leanMass / (heightM * heightM);
    const waterLiters = safeWeight * 0.035 + trainingMinutes / 60 * 0.5;
    const proteinTarget = safeWeight * (goal === "cut" ? 2.3 : goal === "gain" ? 2 : 1.8) + sessionsPerWeek * 2;
    const totalMinutes = timeMinutes + timeSeconds / 60;
    const pacePerKm = distanceKm > 0 ? totalMinutes / distanceKm : 0;
    const speedKmh = totalMinutes > 0 ? distanceKm / (totalMinutes / 60) : 0;
    const projected10k = pacePerKm * 10;
    const estimated1rm = liftWeight * (1 + liftReps / 30);
    const working70 = estimated1rm * 0.7;
    const working80 = estimated1rm * 0.8;
    const working90 = estimated1rm * 0.9;
    const strideMeters = safeHeight * 0.415 / 100;
    const distanceFromSteps = steps * strideMeters / 1000;
    const stepsCalories = safeWeight * distanceFromSteps * 0.75;

    function renderCalculator(): JSX.Element {
        switch (activeTab) {
            case "calories":
                return (
                    <div className="cx-main-grid">
                        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                            <div><div className="label text-gray">Calories Calculator</div><div className="heading-sm cx-section-title">BMR, TDEE и целеви калории</div></div>
                            <div className="cx-form-grid">
                                <SelectField label="Пол" value={sex} onChange={setSex} options={[{ value: "male", label: "Мъж" }, { value: "female", label: "Жена" }]} />
                                <NumberField label="Възраст" value={age} onChange={setAge} suffix="г" min={10} max={100} />
                                <NumberField label="Ръст" value={height} onChange={setHeight} suffix="см" min={120} max={230} />
                                <NumberField label="Тегло" value={weight} onChange={setWeight} suffix="кг" min={35} max={250} />
                                <SelectField label="Активност" value={activity} onChange={setActivity} options={Object.entries(ACTIVITY_MAP).map(([value, item]) => ({ value: value as Activity, label: item.label }))} />
                                <SelectField label="Цел" value={goal} onChange={setGoal} options={[{ value: "cut", label: "Релеф" }, { value: "maintain", label: "Поддръжка" }, { value: "gain", label: "Покачване" }]} />
                            </div>
                            <div className="cx-results-grid">
                                <ResultMetric label="BMR" value={`${round(bmr)} kcal`} hint="Базов разход в покой" />
                                <ResultMetric label="TDEE" value={`${round(tdee)} kcal`} hint="Поддържащ прием" />
                                <ResultMetric label="Target" value={`${round(targetCalories)} kcal`} hint={GOAL_COPY[goal].label} color="var(--c-electric,#0066FF)" />
                                <ResultMetric label="Delta" value={`${GOAL_COPY[goal].calories > 0 ? "+" : ""}${GOAL_COPY[goal].calories} kcal`} hint="Спрямо TDEE" />
                            </div>
                        </div>
                        <InsightCard title="Как да го ползваш">
                            <div className="cx-helper-list">
                                <div className="body-sm text-gray">Започни с target-а за 2 седмици, после коригирай с 100-150 kcal според реалния прогрес.</div>
                                <div className="cx-result-box"><div className="label text-gray">Препоръка</div><div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>За по-устойчив резултат дръж дефицита умерен и следи тегло + енергия, не само калории.</div></div>
                            </div>
                        </InsightCard>
                    </div>
                );
            case "macros":
                return (
                    <div className="cx-main-grid">
                        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                            <div><div className="label text-gray">Macros Calculator</div><div className="heading-sm cx-section-title">Протеин, мазнини и въглехидрати</div></div>
                            <div className="cx-form-grid">
                                <NumberField label="Тегло" value={weight} onChange={setWeight} suffix="кг" min={35} max={250} />
                                <SelectField label="Цел" value={goal} onChange={setGoal} options={[{ value: "cut", label: "Релеф" }, { value: "maintain", label: "Поддръжка" }, { value: "gain", label: "Покачване" }]} />
                                <NumberField label="Ръст" value={height} onChange={setHeight} suffix="см" min={120} max={230} />
                                <SelectField label="Активност" value={activity} onChange={setActivity} options={Object.entries(ACTIVITY_MAP).map(([value, item]) => ({ value: value as Activity, label: item.label }))} />
                            </div>
                            <div className="cx-results-grid">
                                <ResultMetric label="Protein" value={`${round(proteinG)} g`} hint="4 kcal/g" color="#7BDCB5" />
                                <ResultMetric label="Fat" value={`${round(fatG)} g`} hint="9 kcal/g" color="#FFB300" />
                                <ResultMetric label="Carbs" value={`${round(carbsG)} g`} hint="4 kcal/g" color="var(--c-electric,#0066FF)" />
                                <ResultMetric label="Calories" value={`${round(targetCalories)} kcal`} hint="Общ дневен бюджет" />
                            </div>
                        </div>
                        <InsightCard title="Macro split">
                            <div className="cx-helper-list">
                                <div className="cx-result-box"><div className="label text-gray">Protein priority</div><div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>При релеф белтъчините са умишлено по-високи, за да пазят чистата маса и ситостта.</div></div>
                                <div className="cx-progress"><div style={{ width: `${clamp((proteinG * 4 / targetCalories) * 100, 0, 100)}%` }} /></div>
                                <div className="label text-gray">Запълни въглехидратите около тренировки, а мазнините дръж стабилни през деня.</div>
                            </div>
                        </InsightCard>
                    </div>
                );
            case "bmi":
                return (
                    <div className="cx-main-grid">
                        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                            <div><div className="label text-gray">BMI Calculator</div><div className="heading-sm cx-section-title">Индекс на телесна маса</div></div>
                            <div className="cx-form-grid">
                                <NumberField label="Ръст" value={height} onChange={setHeight} suffix="см" min={120} max={230} />
                                <NumberField label="Тегло" value={weight} onChange={setWeight} suffix="кг" min={35} max={250} />
                            </div>
                            <div className="cx-results-grid">
                                <ResultMetric label="BMI" value={round(bmi, 1).toFixed(1)} hint="kg / m²" color="var(--c-electric,#0066FF)" />
                                <ResultMetric label="Категория" value={bmiCategory} hint="Скрийнинг, не пълна диагноза" />
                            </div>
                        </div>
                        <InsightCard title="Тълкуване">
                            <div className="cx-helper-list">
                                <div className="body-sm text-gray">BMI е добър бърз ориентир, но при по-мускулести хора често надценява мазнините.</div>
                                <div className="cx-result-box"><div className="label text-gray">Комбинирай с</div><div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>Body Fat, талия и реален прогрес за по-точна картина.</div></div>
                            </div>
                        </InsightCard>
                    </div>
                );
            case "bodyfat":
                return (
                    <div className="cx-main-grid">
                        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                            <div><div className="label text-gray">Body Fat Calculator</div><div className="heading-sm cx-section-title">US Navy estimate</div></div>
                            <div className="cx-form-grid">
                                <SelectField label="Пол" value={sex} onChange={setSex} options={[{ value: "male", label: "Мъж" }, { value: "female", label: "Жена" }]} />
                                <NumberField label="Ръст" value={height} onChange={setHeight} suffix="см" min={120} max={230} />
                                <NumberField label="Талия" value={waist} onChange={setWaist} suffix="см" min={40} max={200} />
                                <NumberField label="Врат" value={neck} onChange={setNeck} suffix="см" min={20} max={80} />
                                {sex === "female" ? <NumberField label="Ханш" value={hip} onChange={setHip} suffix="см" min={50} max={220} /> : <div />}
                            </div>
                            <div className="cx-results-grid">
                                <ResultMetric label="Body Fat" value={`${round(bodyFat, 1)}%`} hint="Ориентировъчна стойност" color="#FF8A00" />
                                <ResultMetric label="Lean Mass" value={`${round(leanMass, 1)} кг`} hint="Тегло без мазнини" />
                            </div>
                        </div>
                        <InsightCard title="Измерване">
                            <div className="cx-helper-list">
                                <div className="body-sm text-gray">Мери сутрин и еднакво всеки път. По-важен е трендът, не единичната стойност.</div>
                                <div className="cx-result-box"><div className="label text-gray">Fat mass</div><div style={{ color: "var(--color-cream)", fontWeight: 800, marginTop: 6 }}>{round(fatMass, 1)} кг</div></div>
                            </div>
                        </InsightCard>
                    </div>
                );
            case "leanmass":
                return (
                    <div className="cx-main-grid">
                        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                            <div><div className="label text-gray">Lean Mass & FFMI</div><div className="heading-sm cx-section-title">Качество на телесния състав</div></div>
                            <div className="cx-form-grid">
                                <NumberField label="Тегло" value={weight} onChange={setWeight} suffix="кг" min={35} max={250} />
                                <NumberField label="Ръст" value={height} onChange={setHeight} suffix="см" min={120} max={230} />
                                <NumberField label="Талия" value={waist} onChange={setWaist} suffix="см" min={40} max={200} />
                                <NumberField label="Врат" value={neck} onChange={setNeck} suffix="см" min={20} max={80} />
                            </div>
                            <div className="cx-results-grid">
                                <ResultMetric label="Lean Mass" value={`${round(leanMass, 1)} кг`} hint="Обща чиста маса" color="#7BDCB5" />
                                <ResultMetric label="FFMI" value={round(ffmi, 1).toFixed(1)} hint="Lean mass / ръст²" color="var(--c-electric,#0066FF)" />
                            </div>
                        </div>
                        <InsightCard title="FFMI ориентир">
                            <div className="cx-helper-list">
                                <div className="label text-gray">Около 18-20 е солидно, 20-22 е силно athletic ниво, а над това е вече много напреднал профил.</div>
                                <div className="cx-result-box"><div className="label text-gray">Практически прочит</div><div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>Ползвай заедно с body fat, за да видиш дали качваш реално мускул или основно тегло.</div></div>
                            </div>
                        </InsightCard>
                    </div>
                );
            case "water":
                return (
                    <div className="cx-main-grid">
                        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                            <div><div className="label text-gray">Water Intake</div><div className="heading-sm cx-section-title">Дневен прием на вода</div></div>
                            <div className="cx-form-grid">
                                <NumberField label="Тегло" value={weight} onChange={setWeight} suffix="кг" min={35} max={250} />
                                <NumberField label="Тренировка" value={trainingMinutes} onChange={setTrainingMinutes} suffix="мин" min={0} max={300} />
                            </div>
                            <div className="cx-results-grid">
                                <ResultMetric label="Вода" value={`${round(waterLiters, 1)} L`} hint="Базово + тренировка" color="#00C2FF" />
                                <ResultMetric label="Бутилки 500ml" value={`${round(waterLiters * 2)} бр`} hint="Лесен daily target" />
                            </div>
                        </div>
                        <InsightCard title="Практичен режим">
                            <div className="cx-helper-list">
                                <div className="body-sm text-gray">Разпредели водата до ранния следобед и добави още при топло време, изпотяване или по-солени хранения.</div>
                                <div className="cx-result-box"><div className="label text-gray">Преди тренировка</div><div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>Изпий 400-600 ml в рамките на 1-2 часа преди натоварване.</div></div>
                            </div>
                        </InsightCard>
                    </div>
                );
            case "protein":
                return (
                    <div className="cx-main-grid">
                        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                            <div><div className="label text-gray">Protein Target</div><div className="heading-sm cx-section-title">Дневна цел според целта ти</div></div>
                            <div className="cx-form-grid">
                                <NumberField label="Тегло" value={weight} onChange={setWeight} suffix="кг" min={35} max={250} />
                                <SelectField label="Цел" value={goal} onChange={setGoal} options={[{ value: "cut", label: "Релеф" }, { value: "maintain", label: "Поддръжка" }, { value: "gain", label: "Покачване" }]} />
                                <NumberField label="Тренировки / седмица" value={sessionsPerWeek} onChange={setSessionsPerWeek} suffix="бр" min={0} max={14} />
                                <SelectField label="Активност" value={activity} onChange={setActivity} options={Object.entries(ACTIVITY_MAP).map(([value, item]) => ({ value: value as Activity, label: item.label }))} />
                            </div>
                            <div className="cx-results-grid">
                                <ResultMetric label="Protein target" value={`${round(proteinTarget)} g`} hint="Дневен прием" color="#7BDCB5" />
                                <ResultMetric label="Per meal x4" value={`${round(proteinTarget / 4)} g`} hint="Ако ядеш 4 пъти" />
                            </div>
                        </div>
                        <InsightCard title="Разпределение">
                            <div className="cx-helper-list">
                                <div className="body-sm text-gray">Най-лесно се постига с 3-5 хранения, всяко с 25-45 g протеин според телесното тегло.</div>
                                <div className="cx-result-box"><div className="label text-gray">След тренировка</div><div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>Цели 25-40 g качествен протеин около тренировката.</div></div>
                            </div>
                        </InsightCard>
                    </div>
                );
            case "pace":
                return (
                    <div className="cx-main-grid">
                        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                            <div><div className="label text-gray">Pace Calculator</div><div className="heading-sm cx-section-title">Темпо, скорост и време</div></div>
                            <div className="cx-form-grid">
                                <NumberField label="Дистанция" value={distanceKm} onChange={setDistanceKm} suffix="км" min={0.1} max={100} step={0.1} />
                                <NumberField label="Минути" value={timeMinutes} onChange={setTimeMinutes} suffix="мин" min={0} max={500} />
                                <NumberField label="Секунди" value={timeSeconds} onChange={setTimeSeconds} suffix="сек" min={0} max={59} />
                            </div>
                            <div className="cx-results-grid">
                                <ResultMetric label="Pace" value={formatPace(pacePerKm)} hint="Средно темпо" color="var(--c-electric,#0066FF)" />
                                <ResultMetric label="Speed" value={`${round(speedKmh, 1)} km/h`} hint="Средна скорост" />
                                <ResultMetric label="Projected 10K" value={formatPace(projected10k / 10).replace(" /км", "")} hint="При същото темпо" />
                                <ResultMetric label="Total time" value={`${timeMinutes}:${String(timeSeconds).padStart(2, "0")}`} hint="Въведено време" />
                            </div>
                        </div>
                        <InsightCard title="Как да го четеш">
                            <div className="cx-helper-list">
                                <div className="body-sm text-gray">За steady runs темпото е ориентир за издръжливост, а за intervals гледай split-овете отделно.</div>
                                <div className="cx-result-box"><div className="label text-gray">Контрол</div><div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>Ако темпото ти пада рязко, най-често тръгваш твърде бързо.</div></div>
                            </div>
                        </InsightCard>
                    </div>
                );
            case "onerm":
                return (
                    <div className="cx-main-grid">
                        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                            <div><div className="label text-gray">1RM Calculator</div><div className="heading-sm cx-section-title">Estimated one-rep max</div></div>
                            <div className="cx-form-grid">
                                <NumberField label="Работна тежест" value={liftWeight} onChange={setLiftWeight} suffix="кг" min={1} max={500} step={0.5} />
                                <NumberField label="Повторения" value={liftReps} onChange={setLiftReps} suffix="бр" min={1} max={20} />
                            </div>
                            <div className="cx-results-grid">
                                <ResultMetric label="1RM" value={`${round(estimated1rm, 1)} кг`} hint="Epley formula" color="#FF8A00" />
                                <ResultMetric label="70%" value={`${round(working70, 1)} кг`} hint="Volume work" />
                                <ResultMetric label="80%" value={`${round(working80, 1)} кг`} hint="Strength work" />
                                <ResultMetric label="90%" value={`${round(working90, 1)} кг`} hint="Heavy work" />
                            </div>
                        </div>
                        <InsightCard title="Training use">
                            <div className="cx-helper-list">
                                <div className="body-sm text-gray">Този резултат е estimate. Идеален е за programming, но не заменя реален max test в умора.</div>
                                <div className="cx-result-box"><div className="label text-gray">Сигурност</div><div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>Най-надеждни оценки излизат от серии до около 3-8 повторения с добра техника.</div></div>
                            </div>
                        </InsightCard>
                    </div>
                );
            case "steps":
                return (
                    <div className="cx-main-grid">
                        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                            <div><div className="label text-gray">Steps Calculator</div><div className="heading-sm cx-section-title">Крачки, дистанция и kcal estimate</div></div>
                            <div className="cx-form-grid">
                                <NumberField label="Крачки" value={steps} onChange={setSteps} suffix="бр" min={0} max={100000} />
                                <NumberField label="Ръст" value={height} onChange={setHeight} suffix="см" min={120} max={230} />
                                <NumberField label="Тегло" value={weight} onChange={setWeight} suffix="кг" min={35} max={250} />
                            </div>
                            <div className="cx-results-grid">
                                <ResultMetric label="Distance" value={`${round(distanceFromSteps, 2)} км`} hint="По stride estimate" color="var(--c-electric,#0066FF)" />
                                <ResultMetric label="Calories" value={`${round(stepsCalories)} kcal`} hint="При ходене" />
                                <ResultMetric label="Stride" value={`${round(strideMeters, 2)} м`} hint="Ориентировъчна дължина" />
                                <ResultMetric label="10K target" value={`${Math.max(10000 - steps, 0)} steps`} hint="Остават до 10k" />
                            </div>
                        </div>
                        <InsightCard title="Daily movement">
                            <div className="cx-helper-list">
                                <div className="body-sm text-gray">Крачките са добър low-stress инструмент за разход, възстановяване и обща форма.</div>
                                <div className="cx-result-box"><div className="label text-gray">Пример</div><div className="body-sm" style={{ color: "var(--color-cream)", marginTop: 6 }}>Два 15-минутни walk-а след хранене често правят най-лесната разлика.</div></div>
                            </div>
                        </InsightCard>
                    </div>
                );
            default:
                return <div />;
        }
    }

    return (
        <>
            <style>{CX_CSS}</style>
            {isSidebarOpen && <div style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", cursor: "pointer" }} onClick={() => setIsSidebarOpen(false)} />}
            <div className="cx-page">
                <DashboardSidebar theme={theme} onToggleTheme={onToggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="cx-main">
                    <CalculatorsHeader onToggleSidebar={() => setIsSidebarOpen((open) => !open)} />
                    <div className="cx-content">
                        <div className="cx-top-grid">
                            <ProductStatCard label="Subtabs" value="10" sub="най-полезните health calculators на едно място" accent="complete" accentColor="var(--c-acid,#C8FF00)" />
                            <ProductStatCard label="Основен профил" value={`${weight} кг`} sub={`${height} см · ${age} г`} accent={ACTIVITY_MAP[activity].label} accentColor="var(--c-electric,#0066FF)" />
                            <ProductStatCard label="Current TDEE" value={`${round(tdee)} kcal`} sub="база за calories, macros и protein" accent={GOAL_COPY[goal].label} accentColor="rgba(255,255,255,0.45)" />
                            <ProductStatCard label="Performance" value={`${round(estimated1rm)} кг`} sub="текущ estimated 1RM от силовия калкулатор" accent="strength" accentColor="#FF8A00" />
                        </div>
                        <div className="card cx-card" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                            <div><div className="label text-gray">Calculator Tabs</div><div className="heading-sm cx-section-title">Избери tool според задачата</div></div>
                            <div className="cx-tab-row">
                                {TAB_OPTIONS.map((tab) => <button key={tab.key} type="button" className={`cx-tab-btn${activeTab === tab.key ? " cx-tab-btn--active" : ""}`} onClick={() => setActiveTab(tab.key)}>{tab.icon} {tab.label}</button>)}
                            </div>
                        </div>
                        {renderCalculator()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Calculators;
