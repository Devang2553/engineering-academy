/**
 * MASTER CURRICULUM — the single source of truth.
 *
 * Rules:
 *  - This file is stable. The daily schedule adapts; the curriculum does not.
 *  - Append only. IDs are derived from position (JS1-U01, JS1-T001…), so never
 *    reorder or delete entries — add new ones at the end of a subject.
 *  - Every checklist topic lives in exactly one learning unit. Small sibling
 *    topics share a unit, but each keeps its own row and its own knowledge check.
 *
 * Unit tuple: u(title, difficulty 1-3, interviewImportance 1-3, topics, options)
 * Topic tuple: t(name, "subtopic; subtopic; …", kind?)
 */

export type TopicDef = { name: string; subtopics: string[]; kind: "concept" | "exercise" };
export type UnitDef = {
  title: string;
  difficulty: 1 | 2 | 3;
  importance: 1 | 2 | 3;
  topics: TopicDef[];
  after: string[]; // extra prerequisite unit keys, e.g. "JS1-U06"
  free: boolean; // true = does not depend on the previous unit of its subject
};
export type SubjectDef = { code: string; name: string; short: string; units: UnitDef[] };

const t = (name: string, subtopics: string, kind: "concept" | "exercise" = "concept"): TopicDef => ({
  name,
  subtopics: subtopics.split(";").map((s) => s.trim()).filter(Boolean),
  kind,
});
const u = (
  title: string,
  difficulty: 1 | 2 | 3,
  importance: 1 | 2 | 3,
  topics: TopicDef[],
  opts: { after?: string[]; free?: boolean } = {},
): UnitDef => ({ title, difficulty, importance, topics, after: opts.after ?? [], free: opts.free ?? false });

export const CURRICULUM: SubjectDef[] = [
  {
    code: "JS1",
    name: "Namaste JavaScript — Season 1",
    short: "JS Season 1",
    units: [
      u("Execution Context and the Call Stack", 2, 3, [
        t("How JavaScript Works and Execution Context", "Global execution context; Function execution context; Memory creation phase; Code execution phase; Variable environment; Thread of execution"),
        t("How JavaScript Code Is Executed and Call Stack", "Call stack; Execution context creation; Function invocation; Stack frames; Stack overflow"),
      ]),
      u("Hoisting, undefined and not defined", 2, 3, [
        t("Hoisting", "var hoisting; Function declarations; Function expressions; Memory allocation; Undefined values; Hoisting behavior"),
        t("Undefined vs Not Defined", "Undefined; Not defined; Variable initialization; Reference errors"),
      ]),
      u("Functions, window and this", 2, 3, [
        t("How Functions Work and Variable Environment", "Function invocation; Local scope; Variable environment; Parameters and arguments; Return values"),
        t("Shortest JavaScript Program, Window and this", "Global object; window; Global execution context; this keyword; Browser environment"),
      ]),
      u("Scope Chain and Lexical Environment", 2, 3, [
        t("Scope Chain, Scope and Lexical Environment", "Lexical scope; Lexical environment; Outer environment reference; Scope chain; Variable lookup"),
      ]),
      u("let, const, TDZ and Block Scope", 2, 3, [
        t("let, const and Temporal Dead Zone", "let; const; var comparison; Temporal Dead Zone; Block initialization; Reference errors"),
        t("Block Scope and Shadowing", "Block scope; Shadowing; Illegal shadowing; Lexical scope rules"),
      ]),
      u("Closures", 3, 3, [
        t("Closures", "Closure definition; Function with lexical environment; Closure memory behavior; Data privacy; Function factories; Practical use cases"),
      ]),
      u("Closures in Practice: setTimeout and Interview Problems", 3, 3, [
        t("setTimeout and Closures", "setTimeout; Closure behavior in loops; var vs let; Execution timing; Interview coding problems"),
        t("Closure Interview Questions", "Output prediction; Nested closures; Data encapsulation; Counter implementations; Practical closure challenges"),
      ]),
      u("First-Class Functions and Callbacks", 2, 3, [
        t("First-Class Functions and Anonymous Functions", "First-class citizens; Functions as values; Function expressions; Anonymous functions; Callback passing"),
        t("Callback Functions and Event Listeners", "Callback functions; Event listeners; Passing functions; Callback patterns; Inversion of control"),
      ]),
      u("Asynchronous JavaScript and the Event Loop", 3, 3, [
        t("Asynchronous JavaScript and Event Loop", "Synchronous execution; Asynchronous execution; Call stack; Browser Web APIs; Callback queue; Microtask queue; Event loop; setTimeout; Promise callbacks"),
      ]),
      u("JavaScript Engine and V8", 2, 2, [
        t("JavaScript Engine and V8 Architecture", "JavaScript engine; Parsing; Abstract syntax tree; Interpreter; Compiler; JIT compilation; Memory heap; Garbage collection; V8 fundamentals"),
      ]),
      u("Trust Issues with setTimeout", 2, 2, [
        t("Trust Issues with setTimeout", "setTimeout timing; Event loop delays; Callback queue; Execution order; Browser scheduling"),
      ]),
      u("Higher-Order Functions, map, filter and reduce", 2, 3, [
        t("Higher-Order Functions and Functional Programming", "Higher-order functions; Functions as arguments; Functions returned from functions; Functional programming principles; Reusability; Composition"),
        t("map, filter and reduce", "map; filter; reduce; Callback execution; Accumulator; Chaining; Practical data transformations"),
      ]),
    ],
  },
  {
    code: "JS2",
    name: "Namaste JavaScript — Season 2",
    short: "JS Season 2",
    units: [
      u("Callback Hell", 2, 3, [
        t("Callback Hell", "Nested callbacks; Inversion of control; Pyramid of doom; Error handling problems; Refactoring callbacks"),
      ], { after: ["JS1-U09"] }),
      u("Promises: Fundamentals, Chaining and Errors", 3, 3, [
        t("Promises", "Promise fundamentals; Pending, fulfilled and rejected states; Promise creation; Promise resolution; Promise rejection; Promise consumers; Promise error handling"),
        t("Creating Promises, Chaining and Error Handling", "Promise constructor; resolve; reject; then; catch; finally; Promise chaining; Returning promises; Error propagation"),
      ]),
      u("Promise APIs", 3, 3, [
        t("Promise APIs and Interview Questions", "Promise.all; Promise.allSettled; Promise.race; Promise.any; AggregateError; Parallel execution; Failure behavior; Real-world API examples"),
      ]),
      u("Async/Await", 2, 3, [
        t("Async/Await", "async functions; await; Promise handling; Error handling with try/catch; Sequential vs parallel execution; Async execution flow"),
      ]),
      u("The this Keyword", 3, 3, [
        t("this Keyword", "Global this; Object method this; Arrow function this; Function invocation; call; apply; bind; Constructor invocation; this in callbacks"),
      ], { free: true, after: ["JS1-U03", "JS1-U08"] }),
      u("Debouncing and Throttling", 2, 3, [
        t("Debouncing", "Why debounce; Trailing vs leading edge; Implementing debounce with closures; Cancel and flush; Search-input use case"),
        t("Throttling", "Why throttle; Timestamp vs timer implementation; Scroll and resize use cases; Debounce vs throttle trade-offs"),
      ], { free: true, after: ["JS1-U07"] }),
    ],
  },
  {
    code: "ADV",
    name: "Advanced JavaScript",
    short: "Advanced JS",
    units: [
      u("Event Propagation and Delegation", 2, 3, [
        t("Event propagation", "Event flow phases; target vs currentTarget; stopPropagation; preventDefault"),
        t("Capturing and bubbling", "Capture phase; Bubble phase; addEventListener options; Events that do not bubble"),
        t("Event delegation", "Delegating to a parent; Matching targets; Dynamic lists; Performance benefits and pitfalls"),
      ], { free: true, after: ["JS1-U08"] }),
      u("Copies, References and Passing Values", 2, 3, [
        t("Shallow copy and deep copy", "Spread and Object.assign; structuredClone; JSON round-trip limits; Writing a deep clone"),
        t("Object references", "Reference vs value in memory; Equality of objects; Mutation through shared references; Immutability patterns"),
        t("Pass by value and reference behavior", "Primitives passed by value; Call by sharing; Reassign vs mutate; Common output-prediction traps"),
      ], { free: true, after: ["JS1-U03"] }),
      u("Prototypes and Prototypal Inheritance", 3, 3, [
        t("Prototypes", "[[Prototype]] and __proto__; prototype property on functions; Object.create; Own vs inherited properties"),
        t("Prototype chain", "Property lookup; Shadowing on the chain; Object.prototype and null; Method polyfills"),
        t("Prototypal inheritance", "Delegation model; Inheritance without classes; Object.setPrototypeOf; Composition vs inheritance"),
      ], { free: true, after: ["JS2-U05"] }),
      u("Classes and Constructor Functions", 2, 2, [
        t("Constructor functions", "new keyword steps; Instance vs prototype methods; Returning from constructors; instanceof"),
        t("Classes", "Class syntax as prototype sugar; extends and super; Static and private fields; Getters and setters"),
      ], { free: true, after: ["ADV-U03"] }),
      u("ES Modules", 2, 2, [
        t("ES modules", "import and export forms; Live bindings; Static analysis and tree shaking; Dynamic import; ESM vs CommonJS"),
      ], { free: true, after: ["JS1-U05"] }),
      u("Iterators and Generators", 3, 2, [
        t("Iterators", "Iteration protocol; Symbol.iterator; for…of; Custom iterables"),
        t("Generators", "function* and yield; Lazy sequences; Two-way communication; Async generators"),
      ], { free: true, after: ["JS1-U12"] }),
      u("Symbols, Map, Set and Weak Collections", 2, 2, [
        t("Symbols", "Unique keys; Well-known symbols; Symbol registry; Hidden-ish properties"),
        t("Map and Set", "Map vs object; Set operations; Iteration order; When to choose each"),
        t("WeakMap and WeakSet", "Weak references; Garbage-collection behavior; Private data and caches; Limitations"),
      ], { free: true, after: ["ADV-U02"] }),
      u("Error Handling", 2, 3, [
        t("Error handling", "try/catch/finally; Error types and custom errors; Async error handling; Unhandled rejections; Global handlers and reporting"),
      ], { free: true, after: ["JS2-U04"] }),
      u("Memory Leaks and Garbage Collection", 3, 2, [
        t("Garbage collection", "Reachability; Mark and sweep; Generational collection; What the engine cannot collect"),
        t("Memory leaks", "Forgotten timers and listeners; Detached DOM nodes; Closures holding references; Finding leaks with DevTools"),
      ], { free: true, after: ["JS1-U10"] }),
      u("Browser Rendering and Web APIs", 3, 3, [
        t("Browser rendering", "Critical rendering path; DOM and CSSOM; Layout, paint and composite; Reflow and repaint; requestAnimationFrame"),
        t("Web APIs", "fetch and AbortController; Storage APIs; Observers (Intersection, Mutation, Resize); Web Workers"),
      ], { free: true, after: ["JS1-U09"] }),
      u("JavaScript Performance Optimization", 3, 3, [
        t("Performance optimization", "Measuring before optimizing; Avoiding layout thrashing; Debounce, throttle and batching; Code splitting and lazy work; Long tasks and the main thread"),
      ], { free: true, after: ["ADV-U09", "ADV-U10"] }),
    ],
  },
  {
    code: "REACT",
    name: "React — Beginner to Advanced",
    short: "React",
    units: [
      u("React Architecture and JSX", 1, 3, [
        t("React architecture", "Declarative UI; Component tree; React vs ReactDOM; One-way data flow"),
        t("JSX", "JSX to createElement; Expressions and attributes; Fragments; JSX gotchas"),
      ], { after: ["JS1-U06"] }),
      u("Components and Props", 1, 3, [
        t("Components", "Function components; Pure rendering; Naming and files; Component boundaries"),
        t("Props", "Passing data down; children; Default values; Props are read-only"),
      ]),
      u("State and Event Handling", 2, 3, [
        t("State", "State as a snapshot; Updating immutably; Functional updates; Where state should live"),
        t("Event handling", "Synthetic events; Handler references vs calls; Passing arguments; Event pooling history"),
      ]),
      u("Conditional Rendering, Lists and Keys", 2, 3, [
        t("Conditional rendering", "Ternaries and &&; Early returns; Falsy rendering traps; Keeping JSX readable"),
        t("Lists and keys", "Rendering arrays; Stable keys; Index-as-key bugs; Keys and component identity"),
      ], { after: ["JS1-U12"] }),
      u("Forms: Controlled and Uncontrolled", 2, 3, [
        t("Controlled components", "Value plus onChange; Single source of truth; Validation on change; Performance cost"),
        t("Uncontrolled components", "defaultValue and refs; File inputs; When uncontrolled is right"),
        t("Forms", "Submit handling; Multi-field state; Validation strategy; Form libraries trade-offs"),
      ]),
      u("Lifting State Up and Composition", 2, 3, [
        t("Lifting state up", "Shared state in a common parent; Inverse data flow; Prop drilling symptoms"),
        t("Composition", "children and slots; Composition over inheritance; Render props; Compound components"),
      ]),
      u("Context API", 2, 3, [
        t("Context API", "createContext and Provider; useContext; Re-render behavior; Splitting contexts; Context vs state library"),
      ]),
      u("useState and the Rules of Hooks", 2, 3, [
        t("useState", "Lazy initial state; Batching and snapshots; Updater functions; Objects and arrays in state"),
        t("Rules of Hooks", "Top-level only; Only in React functions; Why call order matters; ESLint plugin"),
      ]),
      u("useEffect", 3, 3, [
        t("useEffect", "Synchronizing with external systems; Dependency array; Cleanup; Stale closures; You might not need an effect; Fetching and race conditions"),
      ]),
      u("useRef", 2, 2, [
        t("useRef", "Mutable value without re-render; DOM refs; Refs vs state; forwardRef and ref as a prop"),
      ]),
      u("useMemo and useCallback", 3, 3, [
        t("useMemo", "Memoizing calculations; Referential stability; When it costs more than it saves"),
        t("useCallback", "Stable function identity; Pairing with memo; Dependency pitfalls; React Compiler context"),
      ]),
      u("useReducer", 2, 2, [
        t("useReducer", "Reducer and actions; State machines in UI; useReducer vs useState; Reducer with context"),
      ]),
      u("Custom Hooks", 2, 3, [
        t("Custom hooks", "Extracting stateful logic; Naming and composition; useDebounce and useFetch examples; Testing hooks"),
      ]),
      u("How React Renders: Rendering and the Virtual DOM", 3, 3, [
        t("React rendering", "Trigger, render, commit; What causes a render; Rendering is not DOM update; Purity"),
        t("Virtual DOM", "Element trees; Why a virtual representation; Cost model; Myths about speed"),
      ]),
      u("Reconciliation", 3, 3, [
        t("Reconciliation", "Why reconciliation is needed; Diffing heuristics; How keys influence matching; Unstable keys and state bugs; Debugging unexpected re-renders"),
      ]),
      u("Fiber and the Render and Commit Phases", 3, 2, [
        t("Fiber architecture", "Fiber nodes; Work loop; Interruptible rendering; Priorities and lanes"),
        t("Render phase and commit phase", "Pure render phase; Commit sub-phases; Effect timing; Layout effects"),
      ]),
      u("State Batching and Re-rendering", 3, 3, [
        t("State batching", "Automatic batching; flushSync; Updates in async code; Snapshot semantics"),
        t("Component re-rendering", "Parent re-render cascade; Props vs state vs context triggers; Profiling renders; Common myths"),
      ]),
      u("React.memo and React Performance", 3, 3, [
        t("React.memo", "Shallow prop comparison; Custom comparators; When memo fails; Children and inline props"),
        t("Performance optimization", "React Profiler; State colocation; List virtualization; Avoiding premature memoization"),
      ]),
      u("Suspense, Lazy Loading and Code Splitting", 3, 3, [
        t("Suspense", "Fallback boundaries; Suspense for data; Nested boundaries; Avoiding layout jumps"),
        t("Lazy loading", "React.lazy; Route and component level; Preloading; Error handling"),
        t("Code splitting", "Bundle chunks; Dynamic import; Splitting strategy; Measuring the win"),
      ]),
      u("Error Boundaries and Strict Mode", 2, 2, [
        t("Error boundaries", "What they catch and miss; Fallback UI; Reset strategies; Logging errors"),
        t("Strict Mode", "Double invocation in dev; Finding unsafe effects; What it does not do in production"),
      ]),
      u("Concurrent Rendering", 3, 2, [
        t("Concurrent rendering concepts", "Interruptible renders; useTransition; useDeferredValue; Urgent vs non-urgent updates; Tearing"),
      ]),
      u("React Server Components", 3, 3, [
        t("React Server Components", "Server vs client components; The use client boundary; Serialization rules; RSC payload; RSC is not SSR"),
      ]),
      u("State Management with Zustand", 2, 2, [
        t("State management with Zustand", "Creating a store; Selectors and re-renders; Middleware and persistence; Zustand vs Context vs Redux"),
      ]),
      u("React Query / TanStack Query", 3, 3, [
        t("React Query / TanStack Query", "Server state vs client state; Query keys; Stale time and cache time; Mutations and invalidation; Optimistic updates"),
      ]),
      u("Redux Fundamentals", 2, 2, [
        t("Redux fundamentals", "Store, actions, reducers; Redux Toolkit slices; Selectors; Middleware and thunks; When Redux is worth it"),
      ]),
      u("React Testing Library (React track)", 2, 2, [
        t("React Testing Library", "Testing behavior not implementation; Queries by role; user-event; Async UI assertions"),
      ]),
    ],
  },
  {
    code: "TS",
    name: "TypeScript",
    short: "TypeScript",
    units: [
      u("Type Inference and Primitive Types", 1, 2, [
        t("Type inference", "Inferred vs annotated; Widening and narrowing; const assertions; Contextual typing"),
        t("Primitive types", "string, number, boolean; null and undefined; any, unknown, never; void"),
      ], { after: ["JS1-U05"] }),
      u("Interfaces and Type Aliases", 1, 3, [
        t("Interfaces", "Object shapes; Optional and readonly members; Extending; Declaration merging"),
        t("Type aliases", "Aliasing any type; Interface vs type; Function types; Recursive types"),
      ]),
      u("Union, Intersection and Literal Types", 2, 3, [
        t("Union types", "Either-or values; Narrowing unions; Unions of objects"),
        t("Intersection types", "Combining shapes; Conflicts and never; Intersections vs extends"),
        t("Literal types", "String and numeric literals; Literal unions as enums; Template literal types"),
      ]),
      u("Enums", 1, 1, [
        t("Enums", "Numeric and string enums; const enums; Runtime cost; Union-literal alternative"),
      ]),
      u("Generics and Constraints", 3, 3, [
        t("Generics", "Type parameters; Generic functions and components; Inference of generics; Default type parameters"),
        t("Generic constraints", "extends constraints; keyof constraints; Constraining to shapes; Over-constraining pitfalls"),
      ]),
      u("Utility Types I: Partial and Pick", 2, 3, [
        t("Utility types", "Why utilities exist; How they are built from mapped types; Choosing the right one"),
        t("Partial", "Optional-izing a shape; Update payloads; Required as the inverse"),
        t("Pick", "Selecting keys; Deriving view models; Keeping types in sync"),
      ]),
      u("Utility Types II: Omit, Record and Readonly", 2, 3, [
        t("Omit", "Removing keys; Omit vs Pick; Omit on unions"),
        t("Record", "Dictionary types; Key unions for exhaustiveness; Record vs index signature"),
        t("Readonly", "Immutable shapes; Readonly arrays; Shallow nature of Readonly"),
      ]),
      u("keyof and typeof", 2, 2, [
        t("keyof", "Key unions; Indexed access types; Type-safe property getters"),
        t("typeof", "Types from values; typeof with as const; ReturnType and Parameters"),
      ]),
      u("Narrowing, Type Guards and Discriminated Unions", 3, 3, [
        t("Type narrowing", "typeof, in and instanceof; Truthiness; Control-flow analysis"),
        t("Type guards", "User-defined guards; Assertion functions; Guarding unknown input"),
        t("Discriminated unions", "Tag property; Exhaustive switch with never; Modelling UI and API states"),
      ]),
      u("Conditional Types", 3, 2, [
        t("Conditional types", "T extends U ? X : Y; infer keyword; Distributive behavior; Building Exclude and Extract"),
      ]),
      u("Mapped Types", 3, 2, [
        t("Mapped types", "Iterating keys; Modifiers + and -; Key remapping with as; Rebuilding Partial and Readonly"),
      ]),
      u("Function Overloads", 2, 1, [
        t("Function overloads", "Overload signatures; Implementation signature; Overloads vs unions vs generics"),
      ]),
      u("Typing React Components and Hooks", 2, 3, [
        t("React component typing", "Props types; children and event types; Generic components; Refs"),
        t("Custom hook typing", "Return tuples vs objects; Generic hooks; Typing useReducer and context"),
      ], { after: ["REACT-U13"] }),
      u("API Response Typing and Strict TypeScript", 2, 3, [
        t("API response typing", "Typing fetch results; Runtime validation with schemas; unknown at the boundary; Shared types"),
        t("Strict TypeScript", "strict flag family; strictNullChecks; noUncheckedIndexedAccess; Migrating a codebase"),
      ], { after: ["JS2-U04"] }),
    ],
  },
  {
    code: "NEXT",
    name: "Next.js",
    short: "Next.js",
    units: [
      u("Next.js Architecture and File-System Routing", 2, 3, [
        t("Next.js architecture", "Framework vs library; Server and client runtime; Build output; Bundler and compiler"),
        t("File-system routing", "Folders as routes; page and layout files; Route groups; Colocation"),
      ], { after: ["REACT-U09"] }),
      u("Pages Router and App Router", 2, 3, [
        t("Pages Router", "pages directory; getServerSideProps and getStaticProps; _app and _document; When you still meet it"),
        t("App Router", "app directory; Server Components by default; Nested layouts; Migration differences"),
      ]),
      u("Dynamic Routes and Nested Layouts", 2, 2, [
        t("Dynamic routes", "[param] segments; Catch-all routes; generateStaticParams; Reading params"),
        t("Nested layouts", "Layout persistence; Templates; Parallel and intercepting routes overview"),
      ]),
      u("Loading UI and Error Boundaries", 2, 2, [
        t("Loading UI", "loading file; Suspense boundaries; Skeletons; Instant navigation feel"),
        t("Error boundaries", "error file; global-error; not-found; Recovering with reset"),
      ]),
      u("Route Handlers and Middleware", 2, 2, [
        t("Route handlers", "route file; HTTP methods; Request and Response; Caching of GET handlers"),
        t("Middleware", "Running before a request; Redirects and rewrites; Matchers; Version naming changes (middleware/proxy)"),
      ]),
      u("Rendering Strategies I: CSR and SSR", 3, 3, [
        t("CSR", "Client-side rendering flow; Trade-offs for SEO and TTI; When CSR is right"),
        t("SSR", "Per-request HTML; TTFB vs interactivity; SSR is not Server Components; Cost at scale"),
      ]),
      u("Rendering Strategies II: SSG and ISR", 3, 3, [
        t("SSG", "Build-time HTML; CDN delivery; Limits with dynamic data"),
        t("ISR", "Revalidate intervals; On-demand revalidation; Stale-while-revalidate behavior"),
      ]),
      u("Hydration", 3, 3, [
        t("Hydration", "Attaching interactivity; Hydration mismatches; Selective and streaming hydration; Debugging mismatches"),
      ]),
      u("Server Components and Client Components", 3, 3, [
        t("Server Components", "Zero client JS; Data access on the server; Composition rules; Distinguishing from SSR"),
        t("Client Components", "use client boundary; What ships to the browser; Passing server data down; Keeping the boundary small"),
      ], { after: ["REACT-U19"] }),
      u("Server Actions", 3, 2, [
        t("Server Actions", "use server; Forms and mutations; Revalidating after a mutation; Security considerations"),
      ]),
      u("Streaming and Suspense", 3, 2, [
        t("Streaming", "Chunked HTML; Progressive rendering; Time-to-first-byte gains"),
        t("Suspense", "Boundaries in the App Router; Streaming with fallbacks; Placement strategy"),
      ]),
      u("Data Fetching", 3, 3, [
        t("Data fetching", "Fetching in Server Components; Parallel vs sequential; Request deduplication; Client fetching when needed"),
      ]),
      u("Caching and Revalidation", 3, 3, [
        t("Caching", "Cache layers in Next.js; Version-dependent defaults; Opting in and out; Reading current official docs"),
        t("Revalidation", "Time-based; Tag-based; Path-based; Choosing a strategy"),
      ]),
      u("Metadata and SEO", 1, 2, [
        t("Metadata and SEO", "Static and generated metadata; Open Graph; sitemap and robots; Structured data"),
      ]),
      u("Image and Font Optimization", 1, 2, [
        t("Image optimization", "next/image; Sizes and formats; Layout shift prevention; Remote images"),
        t("Font optimization", "next/font; Self-hosting; Display strategies; Variable fonts"),
      ]),
      u("Authentication and Authorization", 3, 3, [
        t("Authentication", "Sessions vs tokens; Cookies; Auth libraries; Protecting routes"),
        t("Authorization", "Role checks on the server; Data-access layer; Never trusting the client"),
      ]),
      u("Environment Variables and Deployment", 2, 2, [
        t("Environment variables", "Server-only vs NEXT_PUBLIC; Build-time vs runtime; Per-environment config"),
        t("Deployment", "Managed vs self-hosted; Node server, static export, containers; Preview deployments"),
      ]),
      u("Next.js Performance Optimization", 3, 3, [
        t("Performance optimization", "Reducing client JS; Core Web Vitals in Next; Bundle analysis; Prefetching and caching wins"),
      ]),
    ],
  },
  {
    code: "FSD",
    name: "Frontend System Design",
    short: "System Design",
    units: [
      u("Component Architecture and Folder Structure", 2, 3, [
        t("Component architecture", "Presentational vs container; Feature boundaries; Dependency direction; Reuse vs duplication"),
        t("Scalable folder structure", "Feature-based layout; Shared layers; Public APIs per feature; Import rules"),
      ], { after: ["REACT-U07"] }),
      u("Design Systems", 2, 2, [
        t("Design systems", "Tokens; Primitive and composite components; Theming; Documentation and versioning"),
      ]),
      u("API Integration and State Management Decisions", 3, 3, [
        t("API integration architecture", "API client layer; Error and retry policy; Typing contracts; BFF pattern"),
        t("State management decisions", "Server vs client vs URL state; Choosing a tool; Avoiding global state by default"),
      ]),
      u("Authentication and Role-Based Access Control", 3, 3, [
        t("Authentication", "Login flows; Token storage trade-offs; Refresh strategy; Session expiry UX"),
        t("Role-based access control", "Roles and permissions model; Route and component guards; Server enforcement"),
      ]),
      u("Pagination and Infinite Scrolling", 2, 3, [
        t("Pagination", "Offset vs cursor; URL-driven pages; Caching pages; Total counts"),
        t("Infinite scrolling", "Intersection Observer; Virtualization; Scroll restoration; Accessibility concerns"),
      ]),
      u("Search, Filtering and Large Data Tables", 3, 3, [
        t("Search and filtering", "Debounced queries; URL as filter state; Client vs server filtering; Cancelling stale requests"),
        t("Large data tables", "Virtualized rows; Server-side sort and filter; Column configuration; Export"),
      ]),
      u("Caching and Error Handling at Scale", 3, 3, [
        t("Caching", "Browser, CDN and app caches; Invalidation strategies; Stale-while-revalidate; Offline considerations"),
        t("Error handling", "Error taxonomy; Boundaries and fallbacks; Retry and backoff; Monitoring"),
      ]),
      u("Performance and Accessibility by Design", 3, 3, [
        t("Performance", "Performance budgets; Loading strategy; Rendering strategy choice; Measuring in production"),
        t("Accessibility", "Semantic HTML; Keyboard and focus management; ARIA when needed; Colour and motion"),
      ]),
      u("Frontend Security", 3, 3, [
        t("Frontend security", "XSS; CSRF; Content Security Policy; Secure cookies and token handling; Dependency risk"),
      ]),
      u("Micro-frontends", 3, 2, [
        t("Micro-frontends", "When they help; Module federation; Shared dependencies; Team and deployment trade-offs"),
      ]),
      u("Real-time UI and Notifications", 3, 2, [
        t("Real-time UI", "Polling vs SSE vs WebSocket; Reconnection; Optimistic UI; Ordering and consistency"),
        t("Notifications", "In-app vs push; Delivery and read state; Batching; Preferences"),
      ]),
      u("Testing Strategy", 2, 2, [
        t("Testing strategy", "Testing pyramid vs trophy; What to test where; CI gates; Flaky test policy"),
      ]),
      u("Design Exercise: Healthcare Admin Dashboard", 3, 3, [
        t("Healthcare admin dashboard", "Requirements; Architecture diagram; Data and state plan; Access control; Trade-offs", "exercise"),
      ]),
      u("Design Exercise: Analytics Dashboard", 3, 3, [
        t("Analytics dashboard", "Requirements; Chart data pipeline; Filters and caching; Large data handling; Trade-offs", "exercise"),
      ]),
      u("Design Exercise: Notification System", 3, 2, [
        t("Notification system", "Requirements; Real-time delivery; Read state; Failure handling; Trade-offs", "exercise"),
      ]),
      u("Design Exercise: Appointment Scheduling", 3, 2, [
        t("Appointment scheduling application", "Requirements; Calendar model; Conflicts and time zones; Optimistic booking; Trade-offs", "exercise"),
      ]),
      u("Design Exercise: Role-Based Enterprise Portal", 3, 2, [
        t("Role-based enterprise portal", "Requirements; Permission model; Navigation by role; Auditability; Trade-offs", "exercise"),
      ]),
      u("Design Exercise: Large Searchable Patient Table", 3, 3, [
        t("Large searchable patient table", "Requirements; Server-side search; Virtualization; Privacy; Trade-offs", "exercise"),
      ]),
    ],
  },
  {
    code: "AWS",
    name: "AWS",
    short: "AWS",
    units: [
      u("Cloud Fundamentals, Regions and Availability Zones", 1, 2, [
        t("Cloud computing fundamentals", "IaaS, PaaS, SaaS; Shared responsibility; Pay-as-you-go; What a frontend engineer needs"),
        t("Regions and Availability Zones", "Regions; AZs; Edge locations; Latency and resilience"),
      ], { free: true }),
      u("IAM", 2, 2, [
        t("IAM", "Users, roles and policies; Least privilege; Access keys vs roles; Reading a policy"),
      ]),
      u("S3 and Static Website Hosting", 1, 3, [
        t("S3", "Buckets and objects; Permissions; Versioning; Storage classes"),
        t("Static website hosting", "Hosting a build on S3; Index and error documents; SPA routing; Pairing with a CDN"),
      ]),
      u("CloudFront and CDNs", 2, 3, [
        t("CDN", "How a CDN works; Cache keys and TTL; Invalidation; Edge caching for frontends"),
        t("CloudFront", "Distributions and origins; Behaviours; HTTPS and custom domains; Cache invalidation"),
      ]),
      u("EC2", 2, 1, [
        t("EC2", "Instances and AMIs; Security groups; When a frontend needs a server; What belongs to infra specialists"),
      ]),
      u("Lambda and API Gateway", 2, 2, [
        t("Lambda", "Serverless functions; Cold starts; Triggers; Limits"),
        t("API Gateway", "Routing HTTP to Lambda; Stages; Throttling and auth; CORS"),
      ]),
      u("Route 53", 1, 1, [
        t("Route 53", "DNS basics; Record types; Pointing a domain at CloudFront; Health checks overview"),
      ]),
      u("CloudWatch", 1, 1, [
        t("CloudWatch", "Logs and metrics; Alarms; Reading logs for a failing deployment"),
      ]),
      u("Environment Variables and Secrets", 2, 2, [
        t("Environment variables", "Config per environment; Build-time vs runtime; Never shipping secrets to the browser"),
        t("Secrets management", "Secrets Manager and Parameter Store; Rotation; Access through roles"),
      ]),
      u("Next.js Deployment Options on AWS", 2, 2, [
        t("Next.js deployment options", "Static export on S3 + CloudFront; Containers; Amplify and adapters; Choosing by rendering needs"),
      ], { after: ["NEXT-U07"] }),
      u("Basic Cloud Security", 2, 2, [
        t("Basic cloud security", "Public bucket risks; HTTPS everywhere; Key hygiene; Frontend engineer vs cloud specialist scope"),
      ]),
    ],
  },
  {
    code: "DOCKER",
    name: "Docker and CI/CD",
    short: "Docker & CI/CD",
    units: [
      u("Containers vs VMs and Docker Architecture", 1, 2, [
        t("Containers vs virtual machines", "Isolation models; Kernel sharing; Start-up and size; When each fits"),
        t("Docker architecture", "Client, daemon, registry; Layers; Build and run flow"),
      ], { free: true }),
      u("Images and Containers", 1, 2, [
        t("Images", "Layers and caching; Tags; Registries; Base images"),
        t("Containers", "Lifecycle; Running and stopping; Logs and exec; Stateless mindset"),
      ]),
      u("Dockerfile", 2, 3, [
        t("Dockerfile", "FROM, COPY, RUN, CMD; Layer ordering for cache; .dockerignore; ENTRYPOINT vs CMD"),
      ]),
      u("Docker Compose", 2, 2, [
        t("Docker Compose", "Multi-service files; Service dependencies; Local dev stacks; Overrides"),
      ]),
      u("Ports, Volumes and Environment Variables", 1, 2, [
        t("Ports", "Publishing ports; Host vs container ports; Common conflicts"),
        t("Volumes", "Bind mounts vs named volumes; Persisting data; Dev hot reload"),
        t("Environment variables", "ENV and --env-file; Build args vs runtime env; Secrets caution"),
      ]),
      u("Multi-stage Builds and Image Optimization", 2, 3, [
        t("Multi-stage builds", "Builder and runner stages; Copying artifacts; Smaller final images"),
        t("Image optimization", "Slim and distroless bases; Layer count; Dependency pruning; Scanning"),
      ]),
      u("Docker Networking", 2, 1, [
        t("Networking", "Bridge networks; Service discovery by name; Exposing vs publishing"),
      ]),
      u("Dockerizing React and Next.js", 2, 3, [
        t("Dockerizing React", "Build stage; Serving with nginx; SPA fallback; Runtime config"),
        t("Dockerizing Next.js", "Standalone output; Multi-stage Dockerfile; Env handling; Image size"),
      ], { after: ["NEXT-U01"] }),
      u("Containerization Exercise", 3, 2, [
        t("Containerization exercise", "Containerize a real Next.js app; Compose with a database; Verify image size; Document the run steps", "exercise"),
      ]),
      u("CI/CD and GitHub Actions", 2, 3, [
        t("CI/CD", "Continuous integration vs delivery vs deployment; Pipeline stages; Fast feedback"),
        t("GitHub Actions", "Workflows, jobs, steps; Triggers; Caching dependencies; Secrets"),
      ]),
      u("Pipelines: Testing, Builds and Deployment", 2, 2, [
        t("Automated testing", "Running tests in CI; Required checks; Parallelism; Reports"),
        t("Build pipelines", "Lint, type-check, build; Artifacts; Preview builds"),
        t("Deployment workflows", "Environments; Approvals; Rollbacks; Blue-green and canary overview"),
      ]),
    ],
  },
  {
    code: "GQL",
    name: "GraphQL",
    short: "GraphQL",
    units: [
      u("REST vs GraphQL and GraphQL Architecture", 2, 3, [
        t("REST vs GraphQL", "Over- and under-fetching; Single endpoint; Versioning; When REST is the better choice"),
        t("GraphQL architecture", "Client, server, schema; Execution; Introspection; Tooling"),
      ], { after: ["JS2-U04"] }),
      u("Schema and Types", 2, 2, [
        t("Schema", "Schema definition language; Root types; Schema-first vs code-first"),
        t("Types", "Scalars, objects, enums; Non-null and lists; Input types; Interfaces and unions"),
      ]),
      u("Queries, Variables and Fragments", 2, 3, [
        t("Queries", "Selecting fields; Nested data; Aliases; Arguments"),
        t("Variables", "Typed variables; Defaults; Avoiding string interpolation"),
        t("Fragments", "Reusable selections; Colocated fragments; Inline fragments"),
      ]),
      u("Mutations", 2, 2, [
        t("Mutations", "Writing data; Input objects; Return payloads; Updating the cache after"),
      ]),
      u("Subscriptions", 2, 1, [
        t("Subscriptions", "Real-time over WebSocket; Use cases; Scaling concerns; Alternatives"),
      ]),
      u("Resolvers and the N+1 Problem", 3, 3, [
        t("Resolvers", "Resolver signature; Parent, args, context; Resolver chains"),
        t("N+1 problem", "Why it happens; DataLoader batching; Detecting it"),
      ]),
      u("Pagination and Error Handling", 2, 2, [
        t("Pagination", "Offset vs cursor; Connections and edges; fetchMore"),
        t("Error handling", "errors array; Partial data; Error policies; Typed errors in schema"),
      ]),
      u("Authentication in GraphQL", 2, 2, [
        t("Authentication", "Auth in context; Headers from the client; Field-level authorization"),
      ]),
      u("Apollo Client and Caching", 3, 3, [
        t("Apollo Client", "useQuery and useMutation; Loading and error states; React integration; Fetch policies"),
        t("Caching", "Normalized cache; Cache IDs; Reading and writing the cache; Cache vs network"),
      ], { after: ["REACT-U09"] }),
      u("Optimistic Updates and Performance", 3, 2, [
        t("Optimistic updates", "optimisticResponse; Rollback on failure; UX trade-offs"),
        t("Performance considerations", "Query complexity limits; Persisted queries; Batching; Over-fetching in components"),
      ]),
    ],
  },
  {
    code: "AI",
    name: "AI Engineering",
    short: "AI Engineering",
    units: [
      u("AI and LLM Fundamentals", 1, 3, [
        t("Artificial intelligence fundamentals", "AI vs ML vs deep learning; Training vs inference; What models can and cannot do"),
        t("LLM fundamentals", "Next-token prediction; Pre-training and fine-tuning; Sampling and temperature; Limits"),
      ], { free: true }),
      u("Transformers, Tokens and Context Windows", 2, 3, [
        t("Transformers at a conceptual level", "Attention intuition; Encoder vs decoder; Why they scale"),
        t("Tokens", "Tokenization; Tokens vs words; Cost and limits"),
        t("Context windows", "What fits in context; Truncation; Long-context trade-offs"),
      ]),
      u("Prompt Engineering and System Prompts", 2, 3, [
        t("Prompt engineering", "Clear instructions; Examples; Output format control; Iterating with evals"),
        t("System prompts", "Role and rules; Separation from user input; Guardrails"),
      ]),
      u("Context Engineering", 3, 3, [
        t("Context engineering", "Choosing what the model sees; Retrieval, memory and tools as context; Compaction; Ordering and budget"),
      ]),
      u("Structured Outputs and JSON Schema", 2, 3, [
        t("Structured outputs", "Why structure matters; Validation and retries; Schema-constrained generation"),
        t("JSON schema", "Types and required fields; Enums; Nested objects; Designing schemas for models"),
      ]),
      u("Claude API and OpenAI API Concepts", 2, 3, [
        t("Claude API", "Messages API; Models and parameters; System prompt; Error handling and rate limits"),
        t("OpenAI API concepts", "Chat/Responses style APIs; Shared concepts across providers; Portability"),
      ], { after: ["JS2-U04"] }),
      u("Streaming", 2, 2, [
        t("Streaming", "Server-sent events; Rendering tokens in React; Cancellation; Error mid-stream"),
      ]),
      u("Tool Calling and Function Calling", 3, 3, [
        t("Tool calling", "Tool definitions; The call-and-result loop; Parallel tools; Failure handling"),
        t("Function calling", "Mapping to real functions; Argument validation; Naming differences across providers"),
      ]),
      u("Embeddings and Vector Databases", 2, 3, [
        t("Embeddings", "Meaning as vectors; Similarity measures; Embedding models"),
        t("Vector databases", "Indexing and ANN search; Metadata filters; Choosing a store"),
      ]),
      u("Semantic Search and Chunking", 2, 2, [
        t("Semantic search", "Query embedding; Hybrid search; Re-ranking"),
        t("Chunking", "Chunk size and overlap; Structure-aware chunking; Impact on retrieval quality"),
      ]),
      u("RAG", 3, 3, [
        t("RAG", "Retrieve-then-generate pipeline; Grounding and citations; Failure modes; Evaluating RAG"),
      ]),
      u("AI Agents and Agent Workflows", 3, 3, [
        t("AI agents", "Model plus tools in a loop; Autonomy levels; When not to use an agent"),
        t("Agent workflows", "Chaining, routing, parallelization; Orchestrator-workers; Evaluator loops"),
      ]),
      u("Agent Memory and MCP", 3, 3, [
        t("Agent memory", "Short-term vs long-term; Summaries and stores; What to remember"),
        t("MCP", "Model Context Protocol; Servers, tools and resources; Why a standard helps"),
      ]),
      u("Human-in-the-Loop and AI Evaluation", 2, 3, [
        t("Human-in-the-loop", "Approval points; Review UIs; Escalation design"),
        t("AI evaluation", "Test sets; Automated and model graders; Regression tracking"),
      ]),
      u("Hallucinations and AI Security", 3, 3, [
        t("Hallucination handling", "Why models fabricate; Grounding; Abstention; Verifying outputs"),
        t("AI security", "Prompt injection; Data leakage; Tool permission design; Output handling"),
      ]),
      u("Cost and Latency Optimization", 2, 2, [
        t("Cost and latency optimization", "Model selection; Prompt caching; Batching; Streaming for perceived speed"),
      ]),
      u("AI-Assisted Coding and Debugging", 1, 2, [
        t("AI-assisted coding", "Giving context; Reviewing generated code; Staying the engineer in charge"),
        t("AI-assisted debugging", "Reproducing first; Sharing evidence; Verifying the fix"),
      ]),
      u("AI-Assisted Testing and Code Review", 1, 2, [
        t("AI-assisted testing", "Generating cases; Edge-case discovery; Trusting but verifying"),
        t("AI code review", "Review prompts; What AI misses; Combining with human review"),
      ]),
    ],
  },
  {
    code: "TEST",
    name: "Testing and Web Performance",
    short: "Testing & Perf",
    units: [
      u("Unit, Integration and End-to-End Testing", 1, 3, [
        t("Unit testing", "Isolated logic; Arrange-act-assert; What makes a good unit test"),
        t("Integration testing", "Components working together; Realistic boundaries; Confidence per cost"),
        t("End-to-end testing", "Full user journeys; Environment needs; Keeping the suite small"),
      ], { after: ["JS1-U12"] }),
      u("Jest and Vitest", 2, 2, [
        t("Jest", "Runner, matchers, mocks; Snapshot caution; Configuration"),
        t("Vitest", "Vite-native runner; Jest compatibility; Speed and watch mode"),
      ]),
      u("React Testing Library (Testing track)", 2, 3, [
        t("React Testing Library", "render and screen; Accessible queries; Async utilities; Testing hooks and forms"),
      ], { after: ["REACT-U05"] }),
      u("Playwright", 2, 2, [
        t("Playwright", "Locators; Auto-waiting; Fixtures; Traces and debugging"),
      ]),
      u("Mocking APIs", 2, 2, [
        t("Mocking APIs", "Network-level mocks with MSW; Fixtures; Error and slow-network cases"),
      ]),
      u("Browser Rendering and Core Web Vitals", 3, 3, [
        t("Browser rendering", "Rendering pipeline for performance; Render-blocking resources; Main-thread work"),
        t("Core Web Vitals", "LCP, INP, CLS; Lab vs field data; Fixing each metric"),
      ], { after: ["ADV-U10"] }),
      u("Bundle Analysis and Network Optimization", 2, 2, [
        t("Bundle analysis", "Reading a bundle report; Heavy dependencies; Tree shaking checks"),
        t("Network optimization", "Compression; HTTP caching; Preload and prefetch; HTTP/2 and 3"),
      ]),
      u("Lazy Loading and Memory Leaks in Practice", 2, 2, [
        t("Lazy loading", "Images and components; Intersection-based loading; Avoiding layout shift"),
        t("Memory leaks", "Leak patterns in React apps; Heap snapshots; Fix verification"),
      ]),
      u("Accessibility Testing", 2, 2, [
        t("Accessibility testing", "Automated checks with axe; Keyboard walkthroughs; Screen-reader smoke tests"),
      ]),
      u("Performance Profiling", 3, 2, [
        t("Performance profiling", "DevTools Performance panel; React Profiler; Finding long tasks; Before-and-after proof"),
      ]),
    ],
  },
];
