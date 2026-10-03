# rn-todo-list v3.0 — Convex Cloud + Real-Time

Todo-застосунок на React Native (Expo Router), переведений з локального
`AsyncStorage` на хмарний реактивний бекенд **Convex**. Список завдань і
статистика синхронізуються в реальному часі: будь-яка зміна (з телефону,
другого пристрою або Convex Dashboard) миттєво з'являється на всіх екранах.

## Запуск

Потрібно **два термінали**.

**1. Встановлення та підключення Convex (один раз)**

```bash
npm install
npx convex dev
```

У консолі: увійти через GitHub/Email → **Create a new project** →
назвати `rn-todo-list`. Команда створить хмарний деплой, відправить у
нього `convex/schema.ts` і `convex/todos.ts` та залишиться працювати у
фоні (**цей термінал не закривайте**).

**2. Змінна оточення**

Скопіюйте `.env.example` у `.env` і вставте свою адресу деплою (її видно
у виводі `npx convex dev` або у файлі `.env.local`):

```env
EXPO_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud
```

Префікс `EXPO_PUBLIC_` обов'язковий — інакше Expo не передасть змінну в
клієнтський бандл.

**3. Запуск застосунку (другий термінал)**

```bash
npx expo start -c
```

Відскануйте QR-код в **Expo Go** або натисніть `a` / `i` / `w`.

> Якщо змінну не задано, застосунок не впаде, а покаже екран з
> інструкцією, що саме налаштувати.

## Що реалізовано

### Бекенд (`convex/`)
- `schema.ts` — таблиця `todos` (`text`, `isCompleted`, `createdAt`) з
  валідаторами `v.*` та індексами `by_creation` і `by_completion`
- `todos.ts`:
  - queries: `getTodos` (нові → старі), `getStats` (total / active /
    completed / percentage рахуються на сервері)
  - mutations: `createTodo`, `toggleTodo`, `updateTodo`, `deleteTodo`,
    `clearCompleted`, `clearAll`
  - валідація на сервері: порожній текст → `ConvexError`

### Клієнт
- `app/_layout.tsx` — `ConvexProvider` + `ThemeProvider`
- `app/(tabs)/index.tsx` — `useQuery(api.todos.getTodos)` та
  `useMutation`, лоадер «Синхронізація з Convex...» під час першого
  завантаження
- `app/(tabs)/stats.tsx` — `useQuery(api.todos.getStats)`, картки та
  прогрес-бар оновлюються миттєво
- `app/(tabs)/settings.tsx` — перемикач теми та мутації
  `clearCompleted` / `clearAll` з підтвердженням `Alert.alert`
- Застарілий `TodoContext.tsx` і `services/api.ts` видалено — стан тепер
  керується Convex. `ThemeContext` залишено (тема зберігається локально в
  `AsyncStorage`)

## ⚠️ Примітка про назву індексу

У тексті завдання індекс за часом названо `by_creation_time`. Ця назва
**зарезервована Convex**: кожна таблиця вже має вбудований індекс
`by_creation_time` (по системному полю `_creationTime`), і кодогенерація
`npx convex dev` завершується помилкою
`Duplicate index name by_creation_time in table todos`.

Тому власний індекс по полю `createdAt` названо **`by_creation`**
(така сама назва використана в еталонному проєкті `rn-tic-tac-toe`).
Функціонально це те саме: `getTodos` сортує завдання від новіших до
старіших.

## Структура

```
rn-todo-list/
├── app/
│   ├── _layout.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── stats.tsx
│       └── settings.tsx
├── components/
│   ├── Header.tsx
│   ├── TodoForm.tsx
│   ├── TodoItem.tsx
│   └── TodoList.tsx
├── context/
│   └── ThemeContext.tsx
├── convex/
│   ├── _generated/
│   ├── schema.ts
│   └── todos.ts
├── types/
│   └── index.ts
├── .env.example
├── app.json
├── package.json
└── tsconfig.json
```

Папка `convex/_generated/` перегенерується командою `npx convex dev`.

## Як перевірити Real-Time

1. Запустіть застосунок (`npx expo start`).
2. Відкрийте панель Convex: `npx convex dev` вже працює — відкрийте
   Dashboard командою `npx convex dashboard`.
3. У таблиці `todos` додайте/видаліть запис або відкрийте застосунок на
   двох пристроях (наприклад, телефон + браузер, клавіша `w`).
4. Список завдань і лічильники на вкладці «Статистика» оновлюються
   **миттєво**, без ручного оновлення.

## Скріншоти

_Додайте сюди 2–3 скріншоти або GIF: додавання завдання, миттєве
оновлення статистики, масове видалення._

## Перевірка

- `tsc --noEmit` по всьому проєкту — 0 помилок
- 13 автотестів серверних функцій Convex (`convex-test`) — усі проходять:
  валідація, сортування, перемикання, `getStats` (0 % / 33 % / 67 %),
  `clearCompleted`, `clearAll`
- Збірка Metro-бандлером для Android і Web — без помилок
