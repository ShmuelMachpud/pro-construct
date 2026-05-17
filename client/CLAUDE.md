# Client Conventions

## Stack

React 19 + TypeScript + Vite + Material-UI v7 + React Router v7.

## File Structure

```
src/
├── global/
│   ├── components/         ← reusable generic components (GenericForm, etc.)
│   │   ├── GenericForm.tsx ← config-driven form component
│   │   ├── GenericPage.tsx ← full-screen background page wrapper (backgroundImage prop)
│   │   ├── GenericTable.tsx
│   │   └── GenericModal.tsx
│   ├── hooks/              ← reusable hooks shared across modules
│   │   ├── useAuth.ts
│   │   └── useForm.ts      ← generic form state + validation hook
│   ├── services/           ← axios instance with JWT interceptors
│   ├── router.tsx          ← React Router v7 setup; wraps private routes in ProtectedRoute
│   └── theme.ts            ← Material-UI v7 theme with RTL (stylis-plugin-rtl)
├── <module>/               ← e.g. auth/, users/, clients/, projects/, billing/
│   ├── pages/              ← one root component per route (no logic)
│   ├── components/         ← module-specific components (call hooks, render UI)
│   │   └── <feature>/      ← sub-folder when a feature has multiple related components
│   ├── hooks/              ← all data/logic per feature (use<Feature>.ts)
│   ├── helpers/            ← form field configs, column definitions, label/color maps, style constants, pure utils
│   ├── services/           ← API call functions only (no state)
│   └── types/              ← TypeScript types for this module
```

## Conventions

### 1 — Single Responsibility

Every component does **one thing only**.

- A **page** component is the single root component for its route — renders layout and composes components, zero logic.
- **Logic, data fetching, normalization, and service calls** belong exclusively in hooks.

```
LoginPage               ← background layout, renders <LoginForm />
  └── LoginForm         ← calls useLogin, passes data to GenericForm
        └── useLogin    ← useForm + auth service + navigation
```

### 2 — Generic components live in `global/components/`

Components that may be reused across modules must be:
- **Generic** — no business-domain props (`project`, `client`, `user`, etc.)
- **Named** with a descriptive noun: `GenericForm`, `GenericTable`, `GenericModal`
- **Located** in `src/global/components/`

Module-specific components stay inside `<module>/components/`.

### 3 — Components never call services or contain data logic

Page, tile, card, table, and form **files must not**:
- import or call service functions directly
- use `useState` / `useEffect` for data fetching or business logic
- perform data normalization or transformation

All of the above belongs in a hook. The component receives data and callbacks via the hook at its top level.

> Rule of thumb: if you need to find a bug or a `console.log`, open the hook — not the component.

---

## `useForm` — Generic Form Hook

**Location:** `src/global/hooks/useForm.ts`

Manages field state and validation for any form. Accepts an initial data object and infers TypeScript types from it.

```ts
const { values, setValue, errors, validate, reset } = useForm<MyFormType>(initialData);
```

| Return | Type | Description |
|--------|------|-------------|
| `values` | `T` | Current field values |
| `setValue` | `(key: keyof T, value: string) => void` | Update a field; clears its error |
| `errors` | `Partial<Record<keyof T, string>>` | Validation errors per field |
| `validate` | `(rules) => boolean` | Run validation rules, returns `true` if all pass |
| `reset` | `() => void` | Reset values and errors to initial |

**Validation example:**
```ts
const valid = validate({
  email: (v) => !v ? "שדה חובה" : undefined,
  password: (v) => v.length < 6 ? "לפחות 6 תווים" : undefined,
  confirmPassword: (v) => v !== values.password ? "הסיסמאות אינן תואמות" : undefined,
});
if (!valid) return;
```

---

## `GenericForm` — Generic Form Component

**Location:** `src/global/components/GenericForm.tsx`

Config-driven form component. Receives field definitions as an array (`infoForm`) and renders them with full password-toggle support.

```tsx
<GenericForm
  title="ProConstruct"
  subtitle="התחברות למערכת"
  icon={<SomeIcon />}
  infoForm={getLoginFormInfo(values, setValue)}
  onSubmit={handleLogin}
  submitLabel="התחבר"
  loading={loading}
  error={error}
  sx={{ ... }}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Form title |
| `subtitle` | `string?` | Subtitle below the title |
| `icon` | `ReactNode?` | Icon/logo displayed above the title |
| `infoForm` | `FieldConfig[]` | Field definitions (see below) |
| `onSubmit` | `() => void` | Submit handler |
| `submitLabel` | `string` | Button label |
| `loading` | `boolean?` | Disables button and shows `...` |
| `error` | `string?` | Error message below fields |
| `footer` | `ReactNode?` | Content rendered below the submit button (e.g. navigation link) |
| `sx` | `SxProps?` | MUI sx for the Paper container |

**`FieldConfig`:**
```ts
interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number";
  value: string;
  onChange: (value: string) => void;
}
```

Password fields automatically get a show/hide toggle — managed internally by `GenericForm`.

---

## `GenericPage` — Full-Screen Background Page Wrapper

**Location:** `src/global/components/GenericPage.tsx`

Renders a full-screen `Box` with a background image (default: `/proconstruct.jpg`) and a dark overlay, then centers its children on top.

```tsx
<GenericPage>
  <LoginForm />
</GenericPage>

// or with a custom background:
<GenericPage backgroundImage="/other-bg.jpg">
  <SomeForm />
</GenericPage>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content centered on the page |
| `backgroundImage` | `string?` | `/proconstruct.jpg` | CSS background-image URL |

Use `GenericPage` as the root wrapper for all auth pages (login, register) instead of inline background `Box` code.

---

**`footer` — navigation link example:**
```tsx
footer={
  <Typography variant="body2" color="grey.400">
    אין לך חשבון?{" "}
    <Link to="/register" style={{ color: "#FF6B00" }}>הירשם כאן</Link>
  </Typography>
}
```
Use `footer` for cross-page navigation links (login ↔ register). This is pure UI — no hook needed.

---

## Form Pattern — Per Feature

Every form feature follows this structure:

```
<module>/
├── types/<module>.types.ts        ← XxxFormType (exported)
├── helpers/<feature>.helpers.ts   ← initialData + getFormInfo()
├── hooks/use<Feature>.ts          ← useForm<XxxFormType> + service call + validation
├── components/<Feature>Form.tsx   ← GenericForm + hook + helpers
└── pages/<Feature>Page.tsx        ← background/layout + <FeatureForm />
```

**Multi-step forms** use the same pattern but split across step components inside a `components/<feature>/` sub-folder. The parent form component (`RegisterForm`) owns the step state and passes the right step component. Each step receives `values`, `setValue`, and `onNext`/`onBack` callbacks — no logic of its own.

```
auth/components/register/
├── RegisterForm.tsx       ← step orchestrator (useState for step + plan)
├── RegistrationStep.tsx   ← step 1: personal + company details
├── PlanSelector.tsx       ← plan selection (monthly / annual)
├── PaymentStep.tsx        ← step 2: mock card number
└── SuccessStep.tsx        ← final confirmation screen
```

### types file
Define and export the form type:
```ts
export type LoginFormType = {
  email: string;
  password: string;
};

// auth/types/auth.types.ts also exports:
export type RegisterFormType = { name, email, password, confirmPassword, phone, companyName, companyId, address };
export type PaymentFormType = { mockCardNumber: string };
export type RegisterPlan = "monthly" | "annual";
```

### helpers file
Export `initialData` (empty values) and `getFormInfo` (field config builder):
```ts
export const loginInitialData: LoginFormType = { email: "", password: "" };

export const getLoginFormInfo = (
  values: LoginFormType,
  setValue: (key: keyof LoginFormType, value: string) => void
): FieldConfig[] => [...];
```

### hook file
Import type from `types/`, `initialData` from `helpers/`, call `useForm<T>` explicitly:
```ts
const { values, setValue, errors, validate } = useForm<LoginFormType>(loginInitialData);
```

### component file
No logic — just connects hook + helpers + GenericForm:
```tsx
const { values, setValue, error, loading, handleLogin } = useLogin();
return (
  <GenericForm
    infoForm={getLoginFormInfo(values, setValue)}
    onSubmit={handleLogin}
    ...
  />
);
```

---

## Naming Conventions

| Item | Pattern | Example |
|------|---------|---------|
| Pages | `<Feature>Page.tsx` | `LoginPage.tsx` |
| Components | `<Feature>.tsx` | `LoginForm.tsx` |
| Component sub-folders | `components/<feature>/` | `components/register/` |
| Generic components | `Generic<Name>.tsx` | `GenericForm.tsx` |
| Hooks | `use<Feature>.ts` | `useLogin.ts`, `useForm.ts` |
| Services | `<module>.service.ts` | `auth.service.ts` |
| Types | `<module>.types.ts` | `auth.types.ts` |
| Type names | `<Feature>FormType` | `LoginFormType`, `RegisterFormType` |
| Helpers (forms) | `<feature>.helpers.ts` | `register.helpers.ts` |
| Helpers (columns) | `<module>.columns.tsx` | `users.columns.tsx` |
| Helpers (styles) | `<feature>.styles.ts` | `register.styles.ts` |
| Helpers (maps/utils) | `<module>.helpers.ts` | `users.helpers.ts` |
| Initial data | `<feature>InitialData` | `loginInitialData` |
| Form info fn | `get<Feature>FormInfo` | `getLoginFormInfo` |
