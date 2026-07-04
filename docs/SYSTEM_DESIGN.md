# Saptha Swara — System Design Document

## 1. Overview

**Saptha Swara** is a Carnatic music song management Progressive Web App (PWA). Users can create, read, update, delete, search, and filter songs that include metadata such as raga, tala, type, and reference links. Data is persisted in Firebase Realtime Database.

---

## 2. Current Architecture

### 2.1 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 18.2 |
| Language | TypeScript | 5.2 |
| Build Tool | Vite + SWC | 5.2 |
| State Management | Redux Toolkit | 2.2 |
| Database | Firebase Realtime Database | 10.14 |
| Styling | Sass (SCSS) | 1.77 |
| Icons | Font Awesome (Free) | 6.5 |
| Animations | react-transition-group | 4.4 |
| Deployment | Firebase Hosting | — |
| CI/CD | GitHub Actions | — |

### 2.2 Project Structure

```
saptha-swara/
├── src/
│   ├── main.tsx                          # Entry point — Redux Provider
│   ├── App.tsx                           # Root — renders Home + AlertToast
│   ├── firebase.ts                       # Firebase init, read/write helpers
│   ├── Pages/
│   │   └── home/
│   │       ├── Home.tsx                  # Main page (search + list + FAB)
│   │       └── Home.scss
│   ├── components/
│   │   ├── AlertToast/                   # Auto-dismiss toast notification
│   │   ├── add-edit-form/               # Half-sheet form for add/edit song
│   │   ├── filter-selection/            # ~3700 raga lookup list
│   │   ├── floating-button/             # FAB (+)
│   │   ├── half-sheet/                  # Reusable bottom sheet container
│   │   ├── list-card/                   # Song display card with swipe
│   │   ├── search-bar/
│   │   │   ├── SearchBar.tsx            # Text search input
│   │   │   └── FilterBar.tsx            # Type filter chips
│   │   └── FontAwesomeIcon.tsx
│   ├── hooks/
│   │   ├── api-hook/
│   │   │   └── useSongInfo.ts           # Firebase CRUD operations
│   │   └── useSwipe.ts                  # Touch gesture detection
│   ├── store/
│   │   ├── store.ts                     # Redux store config + MyStore type
│   │   └── slices/
│   │       ├── app-slice.ts             # UI state (toast, form, filters)
│   │       ├── search-slice.ts          # Search key + filter options
│   │       └── song-info-slice.ts       # Song data array
│   └── scss/
│       └── _color.scss                  # Design tokens
├── public/
├── dist/                                # Build output
├── .github/workflows/                   # Firebase deploy CI/CD
└── firebase.json                        # Firebase hosting config
```

### 2.3 Data Model

**Firebase Realtime Database Path:** `saptha-swara/songs/{id}`

```typescript
interface SongInfo {
  id: string;        // UUID v4
  name: string;      // Song name
  type: string;      // Category: "Divotional" | "Movie" | "Yakshagana" | "Folk"
  raga: string;      // Carnatic raga name
  tala: string;      // Tala name (e.g. "Adi", "Ekataala") — optional
  refLink: string;   // YouTube/reference URL — optional
}
```

### 2.4 Redux State Shape

```typescript
interface MyStore {
  app: {
    isAddEditOptionEnabled: boolean;   // Show/hide add/edit form
    isEditOption: boolean;             // Edit mode flag (currently unused)
    showToastMessage: boolean;         // Toast visibility
    toastMessage: string;              // Toast text
    editInfo: SongInfo | null;         // Song being edited
    showSearchFilter: boolean;         // Show filter selection in form
  };
  search: {
    searchKey: string;                 // Uppercased search text
    filterOptions: string[];           // Active type filters
  };
  songInfo: {
    songInformation: SongInfo[];       // All songs from Firebase
  };
}
```

### 2.5 Data Flow

```
Firebase RTDB ──onValue──> useSongInfo.readSongDetails()
                                │
                    dispatch(setSongInfo(data))
                                │
                        Redux Store
                          │     │
                    ┌─────┘     └─────┐
                    v                 v
              Home (list)       AddEditForm
              SearchBar         (add/update)
              FilterBar
```

### 2.6 UI Component Tree

```
<App>
  ├── <AlertToast />                    (conditional — on showToastMessage)
  └── <Home>
        ├── <SearchBar>
        │     ├── <input type="search" />
        │     └── <FilterBar />         (conditional)
        │           └── filter chips
        ├── <ListCard />[]              (one per song)
        ├── <AddEditForm />             (conditional — on isAddEditOptionEnabled)
        │     ├── <HalfSheet>
        │     │     └── form inputs
        │     └── <FilterSelection />   (conditional — raga/tala/type picker)
        └── <FloatingButton />          (FAB)
```

---

## 3. Proposed Features — Implementation Plan

### Phase 1: Foundation & Polish

| # | Feature | Description | Effort |
|---|---------|-------------|--------|
| 1.1 | **Swipe-to-delete** | Enable the commented-out delete on swipe (right swipe reveals delete + edit) | Small |
| 1.2 | **Expand search to all fields** | Search by raga, tala, type in addition to name | Small |
| 1.3 | **Sorting** | Sort by name, raga, tala, type (toggleable) | Small |
| 1.4 | **Favorites** | Bookmark songs, show favorites filter toggle | Medium |

### Phase 2: Enhanced Content

| # | Feature | Description | Effort |
|---|---------|-------------|--------|
| 2.1 | **Raga Details Page** | Aarohana/Avarohana scale, associated composers, description | Medium |
| 2.2 | **Lyrics / Swara Notation** | Text area for lyrics/notation, inline expandable view | Medium |
| 2.3 | **In-app Audio/YouTube Player** | Parse `refLink` and embed player or open in-app preview | Medium |
| 2.4 | **Bulk Import/Export** | JSON export/import for backup/sharing | Medium |

### Phase 3: UX & Quality of Life

| # | Feature | Description | Effort |
|---|---------|-------------|--------|
| 3.1 | **Offline Support** | Cache song list via service worker or IndexedDB | Medium |
| 3.2 | **Dark/Light Theme Toggle** | CSS variable-based theme switching | Small |
| 3.3 | **Multi-language Support** | Kannada/Telugu/Tamil script alongside English for raga and song names | Large |

### Phase 4: Advanced Features

| # | Feature | Description | Effort |
|---|---------|-------------|--------|
| 4.1 | **Concert Setlist Mode** | Ordered playlists for performances with quick-access layout | Large |
| 4.2 | **User Authentication** | Firebase Auth — multi-user with private/ shared collections | Large |
| 4.3 | **Statistics Dashboard** | Aggregate views: songs by raga, type, tala, most-used raga, etc. | Medium |
| 4.4 | **Share Song** | Native share API — share song as text or image card | Small |

---

## 4. Architecture Changes Per Feature

### 4.1 Swipe-to-Delete

**Changes:**
- `ListCard.tsx` — Uncomment `removeSongDetails` and `faTimes` icon
- `ListCard.scss` — Add delete option styling (already has commented-out CSS)
- `useSwipe.ts` — Support both left-swipe (delete) and right-swipe (edit)

### 4.2 Expand Search

**Changes:**
- `Home.tsx` — `handleSearch` to check `raga`, `tala`, `type`, `name` fields
- `search-slice.ts` — No Redux changes needed

### 4.3 Sorting

**Changes:**
- `search-slice.ts` — Add `sortBy: string` and `sortOrder: 'asc' | 'desc'` fields
- `Home.tsx` — Apply sort before rendering
- `SearchBar.tsx` or `FilterBar.tsx` — Add sort dropdown/toggle UI

### 4.4 Favorites

**Changes:**
- `SongInfo` — Add `isFavorite: boolean` field
- `firebase.ts` / `useSongInfo.ts` — Add toggle function: `toggleFavorite(id)`
- Redux `song-info-slice` — Update local state on toggle
- `ListCard.tsx` — Show filled/outline heart icon
- `Home.tsx` — Add "Favorites" filter toggle

### 4.5 Raga Details Page

**Changes:**
- New route/page: `src/Pages/raga-details/RagaDetails.tsx`
- New data source: Raga metadata JSON (aarohana, avarohana, melakarta, composers)
- Could store in Firebase or a local JSON file
- Navigation from `ListCard` raga name to detail page

### 4.6 Offline Support

**Architecture:**
- Service Worker via Vite PWA plugin (`vite-plugin-pwa`)
- Cache Firebase data snapshot locally
- Queue write operations when offline, sync when online

### 4.7 Multi-language

**Approach:**
- Store transliterations alongside English name: `nameKannada: string`, `ragaKannada: string`
- Language toggle in settings
- Display appropriate script based on active language

### 4.8 User Authentication

**Architecture:**
- Add Firebase Authentication (Google sign-in, email/password)
- Restructure database path: `saptha-swara/users/{uid}/songs/{id}`
- Add user context provider
- Private vs public sharing via database rules

### 4.9 Setlist Mode

**Changes:**
- New data collection: `saptha-swara/setlists/{id}`
- New Redux slice: `setlist-slice`
- New page: `src/Pages/setlist/Setlist.tsx` — drag-and-drop reorder, quick-launch

---

## 5. Routing Plan (React Router)

```
/                        → Home (song list + search)
/raga/:ragaName          → Raga detail page
/setlists                → Setlist list
/setlists/:id            → Single setlist view/edit
/stats                   → Statistics dashboard
/settings                → Theme, language, export/import
```

---

## 6. Database Schema (Target)

### Songs
```
saptha-swara/
├── songs/{id}
│   ├── id: string
│   ├── name: string
│   ├── nameKannada: string?         # Phase 3
│   ├── type: string
│   ├── raga: string
│   ├── ragaKannada: string?          # Phase 3
│   ├── tala: string
│   ├── refLink: string
│   ├── isFavorite: boolean           # Phase 1.4
│   ├── lyrics: string?               # Phase 2.2
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
├── ragas/{ragaName}                  # Phase 2.1
│   ├── aarohana: string
│   ├── avarohana: string
│   ├── melakarta: string
│   ├── composers: string[]
│   └── description: string
├── setlists/{id}                     # Phase 4.1
│   ├── name: string
│   ├── songs: { order: songId }[]
│   └── createdAt: timestamp
└── users/{uid}/                      # Phase 4.2
    └── settings: { theme, language }
```

---

## 7. New Dependencies Required

| Package | Purpose | Phase |
|---------|---------|-------|
| `react-router-dom` | Client-side routing | 1–4 |
| `vite-plugin-pwa` | Service worker / offline | 3 |
| `firebase` (already present) | Auth, DB | 4 |
| `idb` or `localforage` | IndexedDB for offline cache | 3 |
| `recharts` or `chart.js` | Statistics charts | 4 |

---

## 8. Performance Considerations

- **Raga list**: Move ~3700 ragas from component code to a separate JSON file and lazy-load
- **Virtual list**: For large song collections, use `react-window` or virtualized list
- **Debounce search**: Add debounce to search input (300ms)
- **Firebase listeners**: Use `off()` cleanup in `useEffect` return to prevent memory leaks
- **Code splitting**: Lazy load route pages with `React.lazy` + `Suspense`

---

## 9. Testing Strategy

| Type | Tool | Scope |
|------|------|-------|
| Unit | Vitest + React Testing Library | Redux slices, hooks, pure functions |
| Component | Storybook / RTL | Individual component rendering & interaction |
| E2E | Playwright / Cypress | Full user flows: add, edit, delete, search, filter |
| Firebase | Firebase Emulator Suite | Write/read operations in CI |

---

## 10. Implementation Order (Recommended)

```
Phase 1 — Foundation (small wins, high value)
  ├── 1.1 Swipe-to-delete
  ├── 1.2 Expand search to all fields
  ├── 1.3 Sorting
  └── 1.4 Favorites

Phase 2 — Content enrichment
  ├── 2.1 Raga details page
  ├── 2.2 Lyrics / swara notation
  ├── 2.3 In-app YouTube player
  └── 2.4 Bulk import/export

Phase 3 — Offline & UX
  ├── 3.1 Offline support (PWA)
  ├── 3.2 Theme toggle
  └── 3.3 Multi-language

Phase 4 — Advanced
  ├── 4.1 Concert setlist mode
  ├── 4.2 User authentication
  ├── 4.3 Statistics dashboard
  └── 4.4 Share song
```

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Large raga list (~3700 entries) | Bundle size, slow renders | Move to JSON, lazy load, add search |
| Firebase Realtime DB query limits | Poor filtering/sorting at scale | Consider Firestore or local indexing |
| Offline writes conflicting with online | Data inconsistency | Use Firebase Offline capabilities + conflict resolution |
| No existing tests | Regression risk | Add tests incrementally with each feature |
