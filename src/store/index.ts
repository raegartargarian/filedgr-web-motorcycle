import { configureAppStore } from "./configureStore";

// The store lives here rather than in main.tsx so that modules needing it
// (the axios layer in shared/providers/api) don't import the entry file,
// which would create a circular dependency through main.tsx's render.
export const store = configureAppStore();
