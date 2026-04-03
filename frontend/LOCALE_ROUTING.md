# Locale Routing Setup

This document describes how locale-aware routing is implemented in the Maswada AI Template frontend.

## Overview

The application supports multiple languages (English and Arabic) with locale-based URL routing. URLs are prefixed with the locale code:
- `/en/*` - English routes
- `/ar/*` - Arabic routes

## Architecture

### 1. **App.tsx** - Route Structure
- Redirects root `/` to the default locale (English)
- Validates locale parameters and redirects invalid locales to default
- Uses `LocaleRoutes` component to render authenticated and public routes

### 2. **LanguageProvider** - State Management
- Extracts locale from URL parameters using `useParams`
- Falls back to pathname parsing for added robustness
- Stores current locale in `localStorage` for persistence
- Sets document `dir` (rtl/ltr) and `lang` attributes
- Provides context values: `locale`, `setLocale`, `isRTL`, `toggleLanguage`

### 3. **i18n/index.ts** - Configuration
```typescript
export const defaultLocale = "en"
export const supportedLocales = ["en", "ar"]
```

### 4. **useLocaleNavigate** - Navigation Utility
Provides locale-aware navigation functions:
- `localeNavigate(path, options?)` - Navigate with automatic locale prefix
- `getLocalePath(path)` - Generate locale-prefixed paths
- `navigate()` - Access to React Router's navigate for relative navigation

## Usage Examples

### Navigation in Components
```typescript
import { useLocaleNavigate } from "@/hooks/useLocaleNavigate"

export function MyComponent() {
  const { localeNavigate, getLocalePath } = useLocaleNavigate()

  // Navigate to a page
  const handleClick = () => {
    localeNavigate("/notes/123")  // Becomes /:locale/notes/123
  }

  // Generate a link path
  const linkPath = getLocalePath("/")  // Becomes /:locale
}
```

### Language Switching
```typescript
import { useLanguage } from "@/hooks/useLanguage"

export function Header() {
  const { locale, isRTL, toggleLanguage } = useLanguage()

  return (
    <button onClick={toggleLanguage}>
      {isRTL ? "English" : "العربية"}
    </button>
  )
}
```

### Protected Routes
The `ProtectedRoute` component automatically redirects unauthenticated users to the correct locale sign-in page:
```typescript
<Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
  <Route index element={<HomePage />} />
</Route>
```

## Route Structure

```
/
├── (redirect to /:locale)
├── /:locale
│   ├── (public routes)
│   │   ├── /sign-in
│   │   └── /sign-up
│   └── (protected routes)
│       ├── / (home)
│       ├── /notes/:id
│       └── /* (404)
└── /* (catch-all redirect to default locale)
```

## Key Features

✅ **Automatic Locale Extraction** - From URL parameters with fallback to pathname
✅ **Validation** - Invalid locales redirect to default
✅ **Persistence** - Locale stored in localStorage
✅ **RTL Support** - Automatic document direction based on locale
✅ **Type-Safe** - Full TypeScript support
✅ **Consistent Navigation** - All navigation Helper functions built-in

## Best Practices

1. **Always use `useLocaleNavigate`** for navigation within the app
   ```typescript
   // ✅ Good
   const { localeNavigate } = useLocaleNavigate()
   localeNavigate("/notes")
   
   // ❌ Bad
   const navigate = useNavigate()
   navigate("/notes")  // Missing locale prefix
   ```

2. **Use `getLocalePath` for links**
   ```typescript
   // ✅ Good
   const { getLocalePath } = useLocaleNavigate()
   <Link to={getLocalePath("/")} />
   
   // ❌ Bad
   <Link to="/" />  // Missing locale prefix
   ```

3. **Language Context must be inside LanguageProvider**
   ```typescript
   // App.tsx structure
   <BrowserRouter>
     <LanguageProvider>  {/* Provides context */}
       <IntlWrapper>      {/* Uses context for i18n */}
         <Routes>...</Routes>
       </IntlWrapper>
     </LanguageProvider>
   </BrowserRouter>
   ```

4. **Relative navigation with `-1` works fine**
   ```typescript
   // ✅ This is fine - uses browser history
   const { navigate } = useLocaleNavigate()
   navigate(-1)  // Goes back in history
   ```

## Adding New Languages

To add a new language (e.g., French):

1. **Update i18n config**
   ```typescript
   // i18n/index.ts
   export const supportedLocales = ["en", "ar", "fr"]
   ```

2. **Add translation file**
   ```
   i18n/
   ├── en.json
   ├── ar.json
   └── fr.json
   ```

3. **Update imports**
   ```typescript
   import fr from "./fr.json"
   
   export const messages = {
     en,
     ar,
     fr
   }
   ```

4. **Update LanguageProvider toggleLanguage** (if needed)
   ```typescript
   const toggleLanguage = () => {
     const nextLocale = { en: "ar", ar: "fr", fr: "en" }[locale]
     changeLocale(nextLocale)
   }
   ```

## Internationalization (i18n)

The app uses `react-intl` for message formatting:

```typescript
import { FormattedMessage } from "react-intl"

<FormattedMessage id="common.hello" defaultMessage="Hello" />
<FormattedMessage
  id="common.welcome"
  values={{ name: "John" }}
  defaultMessage="Welcome, {name}!"
/>
```

Messages are loaded from [i18n/ar.json](i18n/ar.json) and [i18n/en.json](i18n/en.json).

## Common Issues & Solutions

### Issue: Pages losing locale when navigating
**Solution:** Use `useLocaleNavigate` hook instead of `useNavigate`

### Issue: Language switch not working
**Solution:** Make sure `useLanguage()` is inside LanguageProvider context

### Issue: localStorage not syncing
**Solution:** Clear browser cache or check localStorage.setItem in LanguageProvider

### Issue: RTL layout not applying
**Solution:** Check that `document.documentElement.dir` is set in LanguageProvider useEffect
