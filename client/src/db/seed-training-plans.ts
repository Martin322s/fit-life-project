import { config } from "dotenv";
import type { TrainingPlanInput } from "../lib/server/repositories/training-plans";

config({ path: ".env" });

type Template = Pick<TrainingPlanInput, "goalType" | "level" | "equipment" | "targetMuscles" | "safetyNotes"> & {
  title: string;
  description: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  averageSessionMinutes: number;
  caloriesBurnEstimate: number;
};

const templates: Template[] = [
  { title: "Старт у дома за начинаещи", description: "Нискоинтензивен план с базови движения без оборудване.", goalType: "general_fitness", level: "beginner", durationWeeks: 6, sessionsPerWeek: 3, averageSessionMinutes: 30, equipment: ["none"], targetMuscles: ["цяло тяло", "крака", "корем"], caloriesBurnEstimate: 180, safetyNotes: ["Дръж темпото разговорно.", "Спри при болка в ставите."] },
  { title: "Отслабване с ниско натоварване", description: "Подходящ за хора с наднормено тегло и нужда от щадящ старт.", goalType: "lose_weight", level: "beginner", durationWeeks: 8, sessionsPerWeek: 4, averageSessionMinutes: 35, equipment: ["none"], targetMuscles: ["цяло тяло", "седалище", "корем"], caloriesBurnEstimate: 220, safetyNotes: ["Избягвай подскоци в първите седмици.", "Увеличавай времето постепенно."] },
  { title: "Начинаещ фитнес 3 дни", description: "Базова програма във фитнес с машини и контролирани тежести.", goalType: "strength", level: "beginner", durationWeeks: 8, sessionsPerWeek: 3, averageSessionMinutes: 50, equipment: ["gym"], targetMuscles: ["гърди", "гръб", "крака", "рамене"], caloriesBurnEstimate: 300, safetyNotes: ["Започни с лека тежест.", "Пази неутрален гръб при всички дърпащи движения."] },
  { title: "Дъмбели за форма", description: "План с дъмбели за домашни или малки зали.", goalType: "general_fitness", level: "beginner", durationWeeks: 6, sessionsPerWeek: 3, averageSessionMinutes: 40, equipment: ["dumbbells"], targetMuscles: ["цяло тяло", "рамене", "крака"], caloriesBurnEstimate: 260, safetyNotes: ["Избирай тежест, с която остават 2 повторения в резерв.", "Загрявай китките и раменете."] },
  { title: "Ластици за тонус", description: "Кратки сесии с ластици за контрол и стабилност.", goalType: "mobility", level: "beginner", durationWeeks: 5, sessionsPerWeek: 4, averageSessionMinutes: 25, equipment: ["resistance bands"], targetMuscles: ["седалище", "гръб", "рамене"], caloriesBurnEstimate: 150, safetyNotes: ["Проверявай ластика за скъсване.", "Движи се плавно без резки дърпания."] },
  { title: "Кардио база на пътека или колело", description: "Постепенно изграждане на издръжливост със стабилно темпо.", goalType: "endurance", level: "beginner", durationWeeks: 7, sessionsPerWeek: 4, averageSessionMinutes: 35, equipment: ["treadmill/bike"], targetMuscles: ["сърдечно-съдова система", "крака"], caloriesBurnEstimate: 280, safetyNotes: ["Следи пулса.", "Оставяй поне един ден за възстановяване."] },
  { title: "Мускулна маса Push Pull Legs", description: "Класически сплит за покачване на сила и мускулна маса.", goalType: "muscle_gain", level: "intermediate", durationWeeks: 10, sessionsPerWeek: 5, averageSessionMinutes: 65, equipment: ["gym"], targetMuscles: ["гърди", "гръб", "крака", "ръце"], caloriesBurnEstimate: 420, safetyNotes: ["Не гони отказ във всяка серия.", "Поддържай техника при прогресивно натоварване."] },
  { title: "Силов фундамент 5x5", description: "Фокус върху базови движения и ясна прогресия.", goalType: "strength", level: "intermediate", durationWeeks: 12, sessionsPerWeek: 3, averageSessionMinutes: 60, equipment: ["gym"], targetMuscles: ["крака", "гръб", "гърди", "ядро"], caloriesBurnEstimate: 380, safetyNotes: ["Загрявай с няколко леки серии.", "Не пропускай почивките между тежките серии."] },
  { title: "HIIT за изгаряне", description: "Кратки интервали с висока интензивност за напреднали начинаещи.", goalType: "lose_weight", level: "intermediate", durationWeeks: 6, sessionsPerWeek: 3, averageSessionMinutes: 28, equipment: ["none"], targetMuscles: ["цяло тяло", "крака", "корем"], caloriesBurnEstimate: 320, safetyNotes: ["Не прави HIIT в последователни дни.", "Намали интензивността при замайване."] },
  { title: "Домашна сила с дъмбели", description: "Силови тренировки с минимално оборудване.", goalType: "strength", level: "intermediate", durationWeeks: 8, sessionsPerWeek: 4, averageSessionMinutes: 45, equipment: ["dumbbells"], targetMuscles: ["крака", "гръб", "рамене", "ръце"], caloriesBurnEstimate: 310, safetyNotes: ["Поддържай стабилна опора.", "Избягвай замах при изолиращи упражнения."] },
  { title: "Издръжливост 10K база", description: "План за постепенно увеличаване на кардио обема.", goalType: "endurance", level: "intermediate", durationWeeks: 10, sessionsPerWeek: 4, averageSessionMinutes: 45, equipment: ["treadmill/bike"], targetMuscles: ["крака", "сърдечно-съдова система"], caloriesBurnEstimate: 420, safetyNotes: ["Увеличавай седмичния обем с малки стъпки.", "Прави лесните дни наистина лесни."] },
  { title: "Мобилност и стойка", description: "План за рамене, таз и гръб за хора с много седене.", goalType: "mobility", level: "beginner", durationWeeks: 4, sessionsPerWeek: 5, averageSessionMinutes: 20, equipment: ["none"], targetMuscles: ["таз", "гръб", "рамене"], caloriesBurnEstimate: 90, safetyNotes: ["Не насилвай крайна амплитуда.", "Дишай спокойно във всяка позиция."] },
  { title: "Ластици за гръб и рамене", description: "Корективен и укрепващ план с ластици.", goalType: "mobility", level: "intermediate", durationWeeks: 6, sessionsPerWeek: 4, averageSessionMinutes: 30, equipment: ["resistance bands"], targetMuscles: ["гръб", "задно рамо", "лопатки"], caloriesBurnEstimate: 140, safetyNotes: ["Дръж ребрата прибрани.", "Не работи през остра болка."] },
  { title: "Advanced Strength Block", description: "Интензивен силов блок с тежки базови упражнения.", goalType: "strength", level: "advanced", durationWeeks: 8, sessionsPerWeek: 4, averageSessionMinutes: 75, equipment: ["gym"], targetMuscles: ["крака", "гръб", "гърди", "рамене"], caloriesBurnEstimate: 520, safetyNotes: ["Използвай спотър при тежки серии.", "Планирай делоууд седмица при умора."] },
  { title: "Hypertrophy Upper Lower", description: "Четиридневен сплит за мускулен растеж с повече обем.", goalType: "muscle_gain", level: "advanced", durationWeeks: 10, sessionsPerWeek: 4, averageSessionMinutes: 70, equipment: ["gym"], targetMuscles: ["горна част", "долна част", "ръце"], caloriesBurnEstimate: 480, safetyNotes: ["Следи възстановяването.", "Не увеличавай едновременно тежест и серии всяка седмица."] },
  { title: "Атлетично кардио", description: "Интервали и темпови сесии за силна издръжливост.", goalType: "endurance", level: "advanced", durationWeeks: 8, sessionsPerWeek: 5, averageSessionMinutes: 50, equipment: ["treadmill/bike"], targetMuscles: ["крака", "дихателна система"], caloriesBurnEstimate: 560, safetyNotes: ["Прави тестова седмица с по-ниска интензивност.", "Не игнорирай признаци на претрениране."] },
];

function structure(plan: Template, index: number): string[] {
  const strength = plan.goalType === "strength" || plan.goalType === "muscle_gain";
  const cardio = plan.goalType === "lose_weight" || plan.goalType === "endurance";
  return [
    `Седмици 1-${Math.ceil(plan.durationWeeks / 3)}: техника, умерено темпо и базов обем.`,
    strength ? "Основна част: 3-5 упражнения с 3-4 серии и контролирана прогресия." : "Основна част: кръгове или интервали с плавно покачване на натоварването.",
    cardio ? "Финал: 8-15 минути кардио или ходене за допълнителен разход." : "Финал: мобилност и разтягане на натоварените мускули.",
    `Всяка ${index % 2 === 0 ? "четвърта" : "трета"} седмица намали обема с около 20% при натрупана умора.`,
  ];
}

function schedule(plan: Template): string[] {
  const rest = "Почивка или 20 минути спокойно ходене";
  if (plan.sessionsPerWeek <= 3) {
    return ["Понеделник: Тренировка A", "Сряда: Тренировка B", "Петък: Тренировка C", `Уикенд: ${rest}`];
  }
  if (plan.sessionsPerWeek === 4) {
    return ["Понеделник: Горна част/кардио", "Вторник: Долна част/мобилност", "Четвъртък: Тренировка C", "Събота: Тренировка D", `Неделя: ${rest}`];
  }
  return ["Понеделник: Тренировка A", "Вторник: Тренировка B", "Сряда: Лека мобилност", "Четвъртък: Тренировка C", "Петък: Тренировка D", "Събота: Кардио/аксесоари", `Неделя: ${rest}`];
}

const plans: TrainingPlanInput[] = templates.flatMap((template, index) => {
  const variants = ["основен", "прогресивен"];
  return variants.map((variant, variantIndex) => ({
    title: variantIndex === 0 ? template.title : `${template.title} - ${variant}`,
    description: variantIndex === 0 ? template.description : `${template.description} Вариантът добавя малко повече обем и по-ясна седмична прогресия.`,
    goalType: template.goalType,
    level: template.level,
    durationWeeks: template.durationWeeks + variantIndex * 2,
    sessionsPerWeek: template.sessionsPerWeek,
    averageSessionMinutes: template.averageSessionMinutes + variantIndex * 5,
    equipment: template.equipment,
    targetMuscles: template.targetMuscles,
    caloriesBurnEstimate: template.caloriesBurnEstimate + variantIndex * 40,
    planStructure: structure(template, index + variantIndex),
    weeklySchedule: schedule(template),
    safetyNotes: template.safetyNotes,
  }));
});

async function main() {
  const repo = await import("../lib/server/repositories/training-plans");
  let created = 0;
  let skipped = 0;

  for (const plan of plans) {
    const existing = await repo.findByTitle(plan.title);
    if (existing) {
      skipped += 1;
      continue;
    }
    await repo.create(plan);
    created += 1;
  }

  console.log(`Training plans seed complete. Created: ${created}. Skipped: ${skipped}.`);
}

main().catch((err) => {
  console.error("Training plans seed failed:", err);
  process.exit(1);
});
