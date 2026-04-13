/**
 * Pose detection service for FitCoach.
 *
 * Provides a unified interface for running pose estimation on camera frames.
 *
 * Architecture:
 * - In development (Expo Go): Uses a mock/stub detector with simulated keypoints
 *   so the app runs without a custom dev client.
 * - In production (custom build): Integrates TensorFlow.js MoveNet or a
 *   converted YOLOv11-pose TFLite model via a native module.
 *
 * To upgrade to real detection:
 *   1. Install @tensorflow/tfjs + @tensorflow-models/pose-detection
 *      (requires `expo prebuild` for native modules)
 *   2. Call `initRealDetector()` instead of using the stub.
 *   3. Pass camera frames as Image tensors to `detectPose()`.
 */

export interface Keypoint {
  id: number;
  label: string;
  x: number;
  y: number;
  confidence: number;
}

export interface PoseDetection {
  keypoints: Keypoint[];
  timestamp: number;
}

// COCO 17 keypoints (used by YOLOv11-pose and MoveNet)
export const COCO_KEYPOINTS = [
  "nose",
  "left_eye",
  "right_eye",
  "left_ear",
  "right_ear",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
] as const;

// Skeleton connections: pairs of keypoint indices to draw lines between
export const SKELETON_CONNECTIONS: [number, number][] = [
  [5, 6],   // left_shoulder → right_shoulder
  [5, 7],   // left_shoulder → left_elbow
  [7, 9],   // left_elbow → left_wrist
  [6, 8],   // right_shoulder → right_elbow
  [8, 10],  // right_elbow → right_wrist
  [5, 11],  // left_shoulder → left_hip
  [6, 12],  // right_shoulder → right_hip
  [11, 12], // left_hip → right_hip
  [11, 13], // left_hip → left_knee
  [13, 15], // left_knee → left_ankle
  [12, 14], // right_hip → right_knee
  [14, 16], // right_knee → right_ankle
];

// Whether real detector is initialized
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let _isInitialized = false;
let _realDetector: any = null;

/**
 * Initialize the pose detector.
 * In dev mode, this is a no-op (stub detector is used).
 * Call `initRealDetector()` for production TFLite/TF.js integration.
 */
export async function initPoseDetector(): Promise<void> {
  // Stub — no-op in dev mode. Call initRealDetector() for production.
}

/**
 * Initialize a real TensorFlow.js MoveNet detector (for custom Expo builds).
 *
 * Usage (after `expo prebuild`):
 * ```ts
 * import * as tf from "@tensorflow/tfjs";
 * import * as poseDetection from "@tensorflow-models/pose-detection";
 * await initRealDetector(tf, poseDetection);
 * ```
 */
export async function initRealDetector(tf: any, poseDetection: any): Promise<void> {
  await tf.ready();
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
  };
  _realDetector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

/**
 * Run pose detection on an image/camera frame.
 *
 * @param imageTensor - Camera frame as a tensor (or null for stub mode)
 * @returns Promise<PoseDetection> with keypoints
 */
export async function detectPose(imageTensor?: any): Promise<PoseDetection> {
  // If real detector is available, use it
  if (_realDetector && imageTensor) {
    const poses = await _realDetector.estimatePoses(imageTensor);
    if (poses.length > 0) {
      const keypoints: Keypoint[] = poses[0].keypoints.map(
        (kp: any, idx: number) => ({
          id: idx,
          label: COCO_KEYPOINTS[idx] ?? `kp_${idx}`,
          x: kp.x,
          y: kp.y,
          confidence: kp.score ?? 0,
        })
      );
      return { keypoints, timestamp: Date.now() };
    }
  }

  // Fallback: generate a realistic stub pose for development/testing
  return generateStubPose();
}

/**
 * Generate a synthetic pose for development without a real model.
 * Simulates a standing person with slight random jitter.
 */
function generateStubPose(): PoseDetection {
  const cx = 187; // center X (half of 375)
  const cy = 200; // center Y offset
  const jitter = () => (Math.random() - 0.5) * 6;

  // Approximate standing person positions (relative to center)
  const basePositions = [
    { x: cx, y: cy - 100 },          // 0: nose
    { x: cx - 8, y: cy - 108 },      // 1: left_eye
    { x: cx + 8, y: cy - 108 },      // 2: right_eye
    { x: cx - 14, y: cy - 102 },     // 3: left_ear
    { x: cx + 14, y: cy - 102 },     // 4: right_ear
    { x: cx - 36, y: cy - 64 },      // 5: left_shoulder
    { x: cx + 36, y: cy - 64 },      // 6: right_shoulder
    { x: cx - 52, y: cy - 20 },      // 7: left_elbow
    { x: cx + 52, y: cy - 20 },      // 8: right_elbow
    { x: cx - 48, y: cy + 28 },      // 9: left_wrist
    { x: cx + 48, y: cy + 28 },      // 10: right_wrist
    { x: cx - 24, y: cy + 20 },      // 11: left_hip
    { x: cx + 24, y: cy + 20 },      // 12: right_hip
    { x: cx - 20, y: cy + 76 },      // 13: left_knee
    { x: cx + 20, y: cy + 76 },      // 14: right_knee
    { x: cx - 18, y: cy + 132 },     // 15: left_ankle
    { x: cx + 18, y: cy + 132 },     // 16: right_ankle
  ];

  const keypoints: Keypoint[] = basePositions.map((pos, idx) => ({
    id: idx,
    label: COCO_KEYPOINTS[idx],
    x: pos.x + jitter(),
    y: pos.y + jitter(),
    confidence: 0.7 + Math.random() * 0.3, // 0.7-1.0
  }));

  return { keypoints, timestamp: Date.now() };
}

/**
 * Reset the detector (useful for cleanup on unmount).
 */
export function resetDetector(): void {
  _isInitialized = false;
  _realDetector = null;
}
