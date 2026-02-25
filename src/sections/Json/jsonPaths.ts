// src/sections/Json/jsonPaths.ts

export const jsonModules = {
  all: [],
  typography: ["typography"],
  colors: ["colors"],
  layout: ["layout"],
  identity: ["identity"]
} as const;

export type JsonModule = keyof typeof jsonModules;