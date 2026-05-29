import { config } from "dotenv";
import type { ChallengeInput } from "../lib/server/repositories/challenges";

config({ path: ".env" });

type Template = {
  title: string;
  description: string;
  category: ChallengeInput["category"];
  difficulty: ChallengeInput["difficulty"];
  durationDays: number;
  targetType: ChallengeInput["targetType"];
  targetValue: number;
  targetUnit: string;
  rewardText: string | null;
  rules: string[];
};

const templates: Template[] = [
  {
    title: "7-дневно предизвикателство за ходене",
    description: "Движи се всеки ден и изгради постоянство с кратки разходки.",
    category: "fitness",
    difficulty: "easy",
    durationDays: 7,
    targetType: "steps",
    targetValue: 70000,
    targetUnit: "крачки",
    rewardText: "Сертификат за постоянство",
    rules: ["Минимум 10 000 крачки дневно.", "Разходките може да са разделени в няколко сесии."],
  },
  {
    title: "10 000 крачки всеки ден",
    description: "Класическа ежедневна цел за активност.",
    category: "fitness",
    difficulty: "medium",
    durationDays: 14,
    targetType: "steps",
    targetValue: 140000,
    targetUnit: "крачки",
    rewardText: "Бадж Движение",
    rules: ["Проследявай крачките ежедневно.", "Не пропускай повече от 1 ден."],
  },
  {
    title: "3 тренировки седмично",
    description: "Постигни устойчив тренировъчен ритъм.",
    category: "consistency",
    difficulty: "medium",
    durationDays: 28,
    targetType: "workouts",
    targetValue: 12,
    targetUnit: "тренировки",
    rewardText: "+300 XP",
    rules: ["Поне 3 завършени тренировки на седмица.", "Тренировките трябва да са в различни дни."],
  },
  {
    title: "30 дни постоянство",
    description: "Всеки ден добавяй поне една здравословна активност.",
    category: "consistency",
    difficulty: "hard",
    durationDays: 30,
    targetType: "consistency",
    targetValue: 30,
    targetUnit: "дни",
    rewardText: "Бадж Streak Master",
    rules: ["Отбелязвай минимум 1 активност дневно.", "Не оставяй 2 поредни дни без прогрес."],
  },
  {
    title: "2 литра вода дневно",
    description: "Подобри хидратацията си с ясна дневна цел.",
    category: "hydration",
    difficulty: "easy",
    durationDays: 21,
    targetType: "water",
    targetValue: 42,
    targetUnit: "литра",
    rewardText: "Hydration Hero",
    rules: ["Пий минимум 2 литра дневно.", "Разпредели приема през деня."],
  },
  {
    title: "Без сладко за 7 дни",
    description: "Кратък reset на навиците към захар.",
    category: "nutrition",
    difficulty: "medium",
    durationDays: 7,
    targetType: "consistency",
    targetValue: 7,
    targetUnit: "дни",
    rewardText: "Sugar Reset",
    rules: ["Без десерти и подсладени напитки.", "Разрешени са само цели плодове."],
  },
  {
    title: "Протеинова цел",
    description: "Поддържай дневен прием на протеин за възстановяване и прогрес.",
    category: "nutrition",
    difficulty: "medium",
    durationDays: 14,
    targetType: "custom",
    targetValue: 14,
    targetUnit: "дни с покрита цел",
    rewardText: "Protein Streak",
    rules: ["Покривай индивидуалната си протеинова цел всеки ден.", "Отбелязвай прогрес ръчно."],
  },
  {
    title: "Проследяване на теглото",
    description: "Изгради навик за редовно и спокойно проследяване.",
    category: "weight loss",
    difficulty: "easy",
    durationDays: 30,
    targetType: "consistency",
    targetValue: 12,
    targetUnit: "измервания",
    rewardText: "Scale Consistency",
    rules: ["Измервай тегло 3 пъти седмично.", "Измервай се по едно и също време."],
  },
  {
    title: "Начинаещо кардио предизвикателство",
    description: "Леки кардио сесии за изграждане на основа.",
    category: "beginner",
    difficulty: "easy",
    durationDays: 14,
    targetType: "workouts",
    targetValue: 8,
    targetUnit: "кардио сесии",
    rewardText: "Cardio Starter",
    rules: ["Сесии между 15 и 30 минути.", "Запази разговорно темпо."],
  },
  {
    title: "Мобилност всеки ден",
    description: "Подобри подвижност и възстановяване с кратки рутини.",
    category: "fitness",
    difficulty: "easy",
    durationDays: 21,
    targetType: "workouts",
    targetValue: 21,
    targetUnit: "мобилити сесии",
    rewardText: "Mobility Flow",
    rules: ["Поне 10 минути мобилност дневно.", "Фокус върху таз, гръб и рамене."],
  },
  {
    title: "Домашни тренировки",
    description: "Тренирай у дома с минимално оборудване.",
    category: "fitness",
    difficulty: "medium",
    durationDays: 21,
    targetType: "workouts",
    targetValue: 10,
    targetUnit: "домашни тренировки",
    rewardText: "Home Workout Hero",
    rules: ["Поне 4 упражнения на тренировка.", "Загрявка 5 минути преди старт."],
  },
  {
    title: "Старт за изгаряне на мазнини",
    description: "Комбинирай движение и хранителна дисциплина за силен старт.",
    category: "weight loss",
    difficulty: "medium",
    durationDays: 30,
    targetType: "calories_burned",
    targetValue: 9000,
    targetUnit: "kcal",
    rewardText: "Fat-Loss Starter",
    rules: ["Поддържай минимум 300 kcal активност дневно.", "Следи напредъка всяка седмица."],
  },
  {
    title: "Meal Prep седмица",
    description: "Планирай и приготвяй храна предварително.",
    category: "nutrition",
    difficulty: "medium",
    durationDays: 7,
    targetType: "custom",
    targetValue: 10,
    targetUnit: "подготвени хранения",
    rewardText: "Meal Prep Pro",
    rules: ["Приготви минимум 10 хранения.", "Разпредели за поне 5 дни."],
  },
  {
    title: "Рутина за сън",
    description: "Изгради стабилен режим на сън и възстановяване.",
    category: "habits",
    difficulty: "medium",
    durationDays: 14,
    targetType: "consistency",
    targetValue: 12,
    targetUnit: "успешни вечери",
    rewardText: "Sleep Routine",
    rules: ["Лягай в рамките на 30 минути от целевия час.", "Ограничи екрани 1 час преди сън."],
  },
];

function variants(template: Template, index: number): ChallengeInput[] {
  const durationBump = index % 3 === 0 ? 3 : 0;
  const valueBump = index % 2 === 0 ? Math.round(template.targetValue * 0.1) : 0;

  return [
    {
      ...template,
      imageUrl: null,
    },
    {
      ...template,
      title: `${template.title} - Ниво +`,
      difficulty: template.difficulty === "easy" ? "medium" : template.difficulty === "medium" ? "hard" : "hard",
      durationDays: template.durationDays + durationBump,
      targetValue: template.targetValue + valueBump,
      rewardText: template.rewardText ? `${template.rewardText} Plus` : "Бонус награда",
      imageUrl: null,
      rules: [...template.rules, "Актуализирай прогреса ръчно поне веднъж дневно."],
    },
    {
      ...template,
      title: `${template.title} - Уикенд режим`,
      durationDays: template.durationDays,
      targetValue: Math.max(1, Math.round(template.targetValue * 0.8)),
      difficulty: template.difficulty,
      rewardText: template.rewardText,
      imageUrl: null,
      rules: [...template.rules, "Планирай предварително за по-силни дни."],
    },
  ];
}

function buildChallenges(): ChallengeInput[] {
  return templates.flatMap(variants).slice(0, 42);
}

async function main() {
  const repo = await import("../lib/server/repositories/challenges");
  let created = 0;
  let skipped = 0;

  for (const challenge of buildChallenges()) {
    const existing = await repo.findByTitle(challenge.title);
    if (existing) {
      skipped += 1;
      continue;
    }
    await repo.create(challenge);
    created += 1;
  }

  console.log(`Challenges seed complete. Created: ${created}. Skipped: ${skipped}.`);
}

main().catch((err) => {
  console.error("Challenges seed failed:", err);
  process.exit(1);
});
