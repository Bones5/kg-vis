export type DeviceClass = "mobile" | "tablet" | "desktop";

export interface DeviceBudget {
  maxNodes: number;
  maxEdges: number;
  deviceClass: DeviceClass;
}
