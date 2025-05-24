declare module 'face-api.js' {
  export interface IPoint {
    x: number;
    y: number;
  }

  export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export interface IDimensions {
    width: number;
    height: number;
  }

  export interface FaceDetection {
    score: number;
    box: IRect;
    landmarks?: Promise<FaceLandmarks>;
    descriptor?: Promise<Float32Array>;
  }

  export interface FaceLandmarks {
    positions: IPoint[];
  }

  export interface FaceExpressions {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  }

  export class TinyFaceDetectorOptions {
    constructor(inputSize?: number, scoreThreshold?: number);
  }

  export class FaceMatcher {
    constructor(distanceThreshold?: number);
    computeMeanDistance(descriptors: Float32Array[]): number;
  }

  export function loadTinyFaceDetectorModel(url: string): Promise<void>;
  export function loadFaceLandmarkModel(url: string): Promise<void>;
  export function loadFaceRecognitionModel(url: string): Promise<void>;
  export function loadFaceExpressionModel(url: string): Promise<void>;

  export function detectSingleFace(
    input: HTMLVideoElement | HTMLCanvasElement,
    options: TinyFaceDetectorOptions
  ): Promise<FaceDetection | null>;

  export function detectFaceExpressions(
    input: HTMLVideoElement | HTMLCanvasElement
  ): Promise<FaceExpressions>;
} 