import { DeviceBudget, DeviceClass } from "@/shared/types/ui";

export function getNodeBudget(width: number): number {
  if (width >= 1200) return 4000;
  if (width >= 900) return 2500;
  if (width >= 600) return 1500;
  return 800;
}

export function getDeviceClass(width: number): DeviceClass {
  if (width >= 1200) return "desktop";
  if (width >= 600) return "tablet";
  return "mobile";
}

export function getDeviceBudget(width: number): DeviceBudget {
  const maxNodes = getNodeBudget(width);
  return {
    maxNodes,
    maxEdges: maxNodes * 3,
    deviceClass: getDeviceClass(width),
  };
}
