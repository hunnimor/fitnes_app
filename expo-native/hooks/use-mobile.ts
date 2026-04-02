import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export function useMobile() {
  const isMobile = width < 768;
  return { isMobile, width, height };
}
