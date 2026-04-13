/**
 * Exercise form analyzer for FitCoach.
 *
 * Uses detected keypoints to:
 * - Calculate joint angles (elbow, knee, hip, shoulder)
 * - Detect exercise phase (up/down for rep counting)
 * - Score form quality and provide correction tips
 */

import type { Keypoint } from "./pose-detection";

export interface JointAngle {
  name: string;
  angle: number; // degrees
}

export interface FormAnalysis {
  score: number; // 0-100
  phase: "up" | "down" | "neutral";
  repCount: number;
  corrections: string[];
  angles: JointAngle[];
}

// Thresholds for rep counting (angles in degrees)
const SQUAT_DOWN_ANGLE = 100; // knee angle when squatted
const PUSHUP_DOWN_ANGLE = 90; // elbow angle at bottom
const LUNGE_DOWN_ANGLE = 95; // knee angle when lunged

/**
 * Calculate the angle at point B formed by points A-B-C.
 * Uses atan2 for robust angle calculation.
 */
export function calculateAngle(
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number }
): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) -
    Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360.0 - angle;
  return angle;
}

/**
 * Get a keypoint by label, or null if not found / low confidence.
 */
function kp(keypoints: Keypoint[], label: string): Keypoint | null {
  const found = keypoints.find((k) => k.label === label);
  if (!found || found.confidence < 0.5) return null;
  return found;
}

/**
 * Analyze squat form from keypoints.
 */
function analyzeSquat(keypoints: Keypoint[]): FormAnalysis {
  const corrections: string[] = [];
  let score = 100;

  const leftHip = kp(keypoints, "left_hip");
  const rightHip = kp(keypoints, "right_hip");
  const leftKnee = kp(keypoints, "left_knee");
  const rightKnee = kp(keypoints, "right_knee");
  const leftAnkle = kp(keypoints, "left_ankle");
  const rightAnkle = kp(keypoints, "right_ankle");

  const angles: JointAngle[] = [];

  // Left knee angle
  if (leftHip && leftKnee && leftAnkle) {
    const angle = calculateAngle(leftHip, leftKnee, leftAnkle);
    angles.push({ name: "left_knee", angle });
    if (angle > 160) {
      score -= 20;
      corrections.push("Глубже! Приседай ниже");
    }
  }

  // Right knee angle
  if (rightHip && rightKnee && rightAnkle) {
    const angle = calculateAngle(rightHip, rightKnee, rightAnkle);
    angles.push({ name: "right_knee", angle });
    if (angle > 160) {
      score -= 20;
      corrections.push("Глубже! Приседай ниже");
    }
  }

  // Knee valgus check (knees caving inward)
  if (leftKnee && rightKnee && leftHip && rightHip) {
    const kneeDiff = Math.abs(leftKnee.x - rightKnee.x);
    const hipDiff = Math.abs(leftHip.x - rightHip.x);
    if (kneeDiff < hipDiff * 0.6) {
      score -= 15;
      corrections.push("Колени в сторону — не своди");
    }
  }

  // Determine phase
  const avgKneeAngle = angles.reduce((s, a) => s + a.angle, 0) / Math.max(angles.length, 1);
  const phase: "up" | "down" | "neutral" =
    avgKneeAngle < SQUAT_DOWN_ANGLE ? "down" : "up";

  return {
    score: Math.max(0, score),
    phase,
    repCount: 0, // rep counting handled externally with phase transitions
    corrections,
    angles,
  };
}

/**
 * Analyze push-up form from keypoints.
 */
function analyzePushup(keypoints: Keypoint[]): FormAnalysis {
  const corrections: string[] = [];
  let score = 100;

  const leftShoulder = kp(keypoints, "left_shoulder");
  const rightShoulder = kp(keypoints, "right_shoulder");
  const leftElbow = kp(keypoints, "left_elbow");
  const rightElbow = kp(keypoints, "right_elbow");
  const leftWrist = kp(keypoints, "left_wrist");
  const rightWrist = kp(keypoints, "right_wrist");
  const leftHip = kp(keypoints, "left_hip");
  const rightHip = kp(keypoints, "right_hip");

  const angles: JointAngle[] = [];

  // Left elbow angle
  if (leftShoulder && leftElbow && leftWrist) {
    const angle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    angles.push({ name: "left_elbow", angle });
    if (angle < 30) {
      score -= 10;
      corrections.push("Не сгибай локти слишком сильно");
    }
  }

  // Right elbow angle
  if (rightShoulder && rightElbow && rightWrist) {
    const angle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    angles.push({ name: "right_elbow", angle });
    if (angle < 30) {
      score -= 10;
      corrections.push("Не сгибай локти слишком сильно");
    }
  }

  // Body alignment (hip should be in line with shoulders)
  if (leftShoulder && rightShoulder && leftHip && rightHip) {
    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipY = (leftHip.y + rightHip.y) / 2;
    const diff = Math.abs(hipY - shoulderY);
    if (diff > 40) {
      score -= 15;
      corrections.push(hipY > shoulderY ? "Не прогибай спину" : "Не поднимай таз");
    }
  }

  // Elbow angle relative to body (should be ~45 degrees)
  if (leftShoulder && leftElbow) {
    const elbowFlare = Math.abs(leftElbow.x - leftShoulder.x);
    if (elbowFlare > 60) {
      score -= 10;
      corrections.push("Локти ближе к телу");
    }
  }

  const avgElbowAngle = angles.reduce((s, a) => s + a.angle, 0) / Math.max(angles.length, 1);
  const phase: "up" | "down" | "neutral" =
    avgElbowAngle < PUSHUP_DOWN_ANGLE ? "down" : "up";

  return { score: Math.max(0, score), phase, repCount: 0, corrections, angles };
}

/**
 * Analyze plank form from keypoints.
 */
function analyzePlank(keypoints: Keypoint[]): FormAnalysis {
  const corrections: string[] = [];
  let score = 100;

  const leftShoulder = kp(keypoints, "left_shoulder");
  const rightShoulder = kp(keypoints, "right_shoulder");
  const leftHip = kp(keypoints, "left_hip");
  const rightHip = kp(keypoints, "right_hip");

  // Hip drop check
  if (leftShoulder && rightShoulder && leftHip && rightHip) {
    const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipMidY = (leftHip.y + rightHip.y) / 2;
    const diff = Math.abs(hipMidY - shoulderMidY);

    if (diff > 30) {
      score -= 20;
      corrections.push(
        hipMidY > shoulderMidY ? "Таз ниже — держи линию" : "Подними таз"
      );
    }
  }

  // Shoulder width check (shrugging)
  if (leftShoulder && rightShoulder) {
    const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
    if (shoulderWidth < 40) {
      score -= 10;
      corrections.push("Расправь плечи");
    }
  }

  return { score: Math.max(0, score), phase: "neutral", repCount: 0, corrections, angles: [] };
}

/**
 * Main analyzer — dispatches to the right exercise analyzer.
 */
export function analyzeForm(
  keypoints: Keypoint[],
  exerciseName: string
): FormAnalysis {
  const name = exerciseName.toLowerCase();

  if (name.includes("присед") || name.includes("squat")) {
    return analyzeSquat(keypoints);
  }
  if (name.includes("отжим") || name.includes("pushup") || name.includes("push-up")) {
    return analyzePushup(keypoints);
  }
  if (name.includes("планк") || name.includes("plank")) {
    return analyzePlank(keypoints);
  }
  if (name.includes("выпад") || name.includes("lunge")) {
    return analyzeLunge(keypoints);
  }

  // Generic fallback — basic posture check
  return genericAnalysis(keypoints);
}

/**
 * Analyze lunge form.
 */
function analyzeLunge(keypoints: Keypoint[]): FormAnalysis {
  const corrections: string[] = [];
  let score = 100;

  const leftHip = kp(keypoints, "left_hip");
  const leftKnee = kp(keypoints, "left_knee");
  const leftAnkle = kp(keypoints, "left_ankle");

  const angles: JointAngle[] = [];

  if (leftHip && leftKnee && leftAnkle) {
    const angle = calculateAngle(leftHip, leftKnee, leftAnkle);
    angles.push({ name: "left_knee", angle });
    if (angle < 70) {
      score -= 15;
      corrections.push("Колено не за носок");
    }
  }

  const avgAngle = angles.reduce((s, a) => s + a.angle, 0) / Math.max(angles.length, 1);
  const phase: "up" | "down" | "neutral" =
    avgAngle < LUNGE_DOWN_ANGLE ? "down" : "up";

  return { score: Math.max(0, score), phase, repCount: 0, corrections, angles };
}

/**
 * Generic posture analysis for exercises without specific logic.
 */
function genericAnalysis(keypoints: Keypoint[]): FormAnalysis {
  let score = 80;
  const corrections: string[] = [];

  // Check if person is centered in frame
  const validKps = keypoints.filter((k) => k.confidence > 0.5);
  if (validKps.length < 8) {
    score -= 30;
    corrections.push("Отойди — я не вижу всё тело");
  }

  // Check overall body alignment (shoulders above hips)
  const shoulders = keypoints.filter(
    (k) => (k.label === "left_shoulder" || k.label === "right_shoulder") && k.confidence > 0.5
  );
  const hips = keypoints.filter(
    (k) => (k.label === "left_hip" || k.label === "right_hip") && k.confidence > 0.5
  );

  if (shoulders.length === 2 && hips.length === 2) {
    const avgShoulderY = (shoulders[0].y + shoulders[1].y) / 2;
    const avgHipY = (hips[0].y + hips[1].y) / 2;
    // In camera coords, lower Y = higher in frame
    if (avgHipY < avgShoulderY - 20) {
      score -= 15;
      corrections.push("Держи корпус ровно");
    }
  }

  return {
    score: Math.max(0, score),
    phase: "neutral",
    repCount: 0,
    corrections,
    angles: [],
  };
}

/**
 * Rep counter — tracks phase transitions to count completed reps.
 */
export class RepCounter {
  private count = 0;
  private lastPhase: "up" | "down" | "neutral" = "neutral";

  /**
   * Update with new phase detection. Returns updated count.
   */
  update(phase: "up" | "down" | "neutral"): number {
    // A rep = down → up transition
    if (this.lastPhase === "down" && phase === "up") {
      this.count++;
    }
    this.lastPhase = phase;
    return this.count;
  }

  /**
   * Get current rep count.
   */
  getCount(): number {
    return this.count;
  }

  /**
   * Reset the counter.
   */
  reset(): void {
    this.count = 0;
    this.lastPhase = "neutral";
  }
}
