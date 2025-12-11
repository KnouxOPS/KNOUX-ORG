/**
 * Updated type definitions for Knoux SmartOrganizer PRO
 * Compatible with the unified AI engine
 */

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  url: string;
  thumbnail?: string;
  processed: boolean;
  analysis?: ImageAnalysis;
  category?: ImageCategory;
  tags: string[];
  createdAt: Date;
  processedAt?: Date;
}

export interface ImageAnalysis {
  id: string;
  file: File;
  previewUrl: string;
  error?: string;

  // Basic metadata
  dimensions: { width: number; height: number };
  size: number; // in MB

  // AI analysis results
  classification?: { label: string; score: number }[];
  description?: string;
  objects?: { box: any; label: string; score: number }[];
  nsfw?: {
    className: "Porn" | "Hentai" | "Sexy" | "Drawing" | "Neutral";
    probability: number;
  }[];
  faces?: {
    age: number;
    gender: "male" | "female" | "unknown";
    expression: string;
    confidence: number;
    box: any;
  }[];
  ocrText?: string;
  pHash?: string;
  quality?: {
    sharpness: number;
    contrast: number;
    brightness: number;
    score: number;
  };
  palette?: string[];

  // Processing stats
  processingTime: number;
  timestamp: Date;

  // Legacy compatibility
  confidence?: number;
  dominantColors?: string[];
  duplicateHash?: string;
  isNSFW?: boolean;
  nsfwScore?: number;
  text?: {
    text: string;
    confidence: number;
    words?: any[];
  };
}

export type ImageCategory =
  | "selfies"
  | "documents"
  | "screenshots"
  | "nature"
  | "food"
  | "art"
  | "nsfw"
  | "duplicates"
  | "general"
  | "memes"
  | "receipts"
  | "qr-codes"
  | "pets"
  | "vehicles"
  | "architecture";

export interface ProcessingStats {
  total: number;
  processed: number;
  successful: number;
  errors: number;
  categorized: Record<ImageCategory, number>;
  avgProcessingTime: number;
  startTime: Date;
  endTime?: Date;
}

export interface FilterOptions {
  categories: ImageCategory[];
  hasText: boolean;
  hasFaces: boolean;
  isNSFW: boolean;
  minSize: number;
  maxSize: number;
  dateRange: {
    start?: Date;
    end?: Date;
  };
  tags: string[];
  searchQuery: string;
}

export interface OrganizeOptions {
  autoRename: boolean;
  createSubfolders: boolean;
  moveFiles: boolean;
  addTags: boolean;
  generateThumbnails: boolean;
  extractText: boolean;
  detectFaces: boolean;
  checkNSFW: boolean;
  findDuplicates: boolean;
  qualityThreshold: number;
}

export interface AIModel {
  name: string;
  type: "classification" | "detection" | "ocr" | "nsfw";
  loaded: boolean;
  loading: boolean;
  error?: string;
  version: string;
  size: string;
  progress?: number;
}

export interface ProcessingProgress {
  current: number;
  total: number;
  status: "idle" | "loading" | "processing" | "complete" | "error";
  currentFile?: string;
  stage: "upload" | "analysis" | "classification" | "organization" | "complete";
  message: string;
  estimatedTimeLeft?: number;
}

export interface SmartSuggestion {
  id: string;
  type: "rename" | "category" | "tag" | "merge" | "delete";
  confidence: number;
  description: string;
  imageIds: string[];
  action: () => Promise<void>;
  preview?: string;
}

export interface DuplicateGroup {
  group: string[];
  similarity: number;
}
