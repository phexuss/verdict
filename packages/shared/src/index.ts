export const API_VERSION = "v1" as const;

export type SupportedLocale = "en" | "ru";

export type HealthResponse = {
  status: "ok";
  version: typeof API_VERSION;
  timestamp: string;
};
