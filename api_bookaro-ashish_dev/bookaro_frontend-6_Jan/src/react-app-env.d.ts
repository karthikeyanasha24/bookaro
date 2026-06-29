/// <reference types="react-scripts" />

declare module "redux-persist/es/integration/react" {
  import { ComponentType, ReactNode } from "react";
  export interface PersistGateProps {
    loading?: ReactNode;
    persistor: unknown;
    children?: ReactNode;
  }
  export const PersistGate: ComponentType<PersistGateProps>;
}

declare module "@testing-library/react" {
  import { ReactElement } from "react";

  export interface Screen {
    getByText(id: string | RegExp, options?: object): HTMLElement;
    queryByText(id: string | RegExp, options?: object): HTMLElement | null;
    getByRole(role: string, options?: object): HTMLElement;
  }

  export const screen: Screen;
  export function render(ui: ReactElement): void;
}

declare module "web-vitals" {
  export type ReportHandler = (metric: unknown) => void;
  export function getCLS(onReport: ReportHandler): void;
  export function getFID(onReport: ReportHandler): void;
  export function getFCP(onReport: ReportHandler): void;
  export function getLCP(onReport: ReportHandler): void;
  export function getTTFB(onReport: ReportHandler): void;
}
