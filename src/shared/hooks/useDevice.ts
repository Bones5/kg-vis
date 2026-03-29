import { useEffect, useState } from "react";
import { DeviceBudget } from "@/shared/types/ui";
import { getDeviceBudget } from "@/shared/lib/device";

export function useDevice(): DeviceBudget {
  const [budget, setBudget] = useState<DeviceBudget>(() =>
    getDeviceBudget(window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => setBudget(getDeviceBudget(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return budget;
}
