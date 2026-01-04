"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { buttonTap, buttonTapMobile, buttonHover } from "./variants";

// Device type detection with breakpoints
export type DeviceType = "mobile" | "tablet" | "desktop";

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    const getDeviceType = (): DeviceType => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) return "mobile";
      if (width < TABLET_BREAKPOINT) return "tablet";
      return "desktop";
    };

    // Set initial value
    setDeviceType(getDeviceType());

    // Debounced resize handler
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDeviceType(getDeviceType());
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    deviceType,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop",
  };
}

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export function useAnimationConfig() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  return useMemo(
    () => ({
      shouldAnimate: !prefersReducedMotion,
      isMobile,
      tapGesture: isMobile ? buttonTapMobile : buttonTap,
      hoverGesture: isMobile ? {} : buttonHover,
    }),
    [prefersReducedMotion, isMobile]
  );
}
