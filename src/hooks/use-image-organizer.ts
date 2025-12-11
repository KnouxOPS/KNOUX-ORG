/**
 * Updated Image Organizer Hook
 * Integrated with unified AI engine
 */

import { useState, useCallback, useRef } from "react";
import type {
  ImageFile,
  ProcessingProgress,
  ProcessingStats,
  FilterOptions,
  OrganizeOptions,
  SmartSuggestion,
  ImageCategory,
  ImageAnalysis,
} from "@/types/organizer-updated";
import { aiEngine } from "@/lib/ai-engine-unified";

const DEFAULT_ORGANIZE_OPTIONS: OrganizeOptions = {
  autoRename: true,
  createSubfolders: true,
  moveFiles: false,
  addTags: true,
  generateThumbnails: true,
  extractText: true,
  detectFaces: true,
  checkNSFW: true,
  findDuplicates: true,
  qualityThreshold: 0.7,
};

const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  categories: [],
  hasText: false,
  hasFaces: false,
  isNSFW: false,
  minSize: 0,
  maxSize: Infinity,
  dateRange: {},
  tags: [],
  searchQuery: "",
};

export function useImageOrganizer() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress>({
    current: 0,
    total: 0,
    status: "idle",
    stage: "upload",
    message: "Ready to organize images",
  });
  const [stats, setStats] = useState<ProcessingStats>({
    total: 0,
    processed: 0,
    successful: 0,
    errors: 0,
    categorized: {} as Record<ImageCategory, number>,
    avgProcessingTime: 0,
    startTime: new Date(),
  });
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [organizeOptions, setOrganizeOptions] = useState<OrganizeOptions>(
    DEFAULT_ORGANIZE_OPTIONS
  );
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Add images to the collection
   */
  const addImages = useCallback(
    async (files: File[]) => {
      const newImages: ImageFile[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;

        const imageFile: ImageFile = {
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          url: URL.createObjectURL(file),
          processed: false,
          tags: [],
          createdAt: new Date(),
        };

        if (organizeOptions.generateThumbnails) {
          imageFile.thumbnail = await generateThumbnail(file);
        }

        newImages.push(imageFile);
      }

      setImages((prev) => [...prev, ...newImages]);
      return newImages;
    },
    [organizeOptions.generateThumbnails]
  );

  /**
   * Generate thumbnail for an image
   */
  const generateThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        const size = 150;
        canvas.width = size;
        canvas.height = size;

        const scale = Math.min(size / img.width, size / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (size - width) / 2;
        const y = (size - height) / 2;

        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, x, y, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.8));
        URL.revokeObjectURL(img.src);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  /**
   * Process all unprocessed images
   */
  const processImages = useCallback(async () => {
    if (isProcessing || images.length === 0) return;

    setIsProcessing(true);
    abortControllerRef.current = new AbortController();

    const startTime = new Date();
    const unprocessedImages = images.filter((img) => !img.processed);

    setProgress({
      current: 0,
      total: unprocessedImages.length,
      status: "processing",
      stage: "analysis",
      message: "Analyzing images with AI...",
    });

    setStats({
      total: unprocessedImages.length,
      processed: 0,
      successful: 0,
      errors: 0,
      categorized: {} as Record<ImageCategory, number>,
      avgProcessingTime: 0,
      startTime,
    });

    let processed = 0;
    let successful = 0;
    let errors = 0;
    const categorized = {} as Record<ImageCategory, number>;
    const processingTimes: number[] = [];

    for (const image of unprocessedImages) {
      if (abortControllerRef.current?.signal.aborted) break;

      const imageStartTime = Date.now();

      try {
        setProgress((prev) => ({
          ...prev,
          current: processed + 1,
          currentFile: image.name,
          message: `Processing ${image.name}...`,
        }));

        // Analyze image with unified AI engine
        const analysis = await aiEngine.analyzeImage(image.file);
        
        // Categorize based on analysis
        const category = aiEngine.categorizeImage(analysis);
        
        // Generate smart filename if enabled
        const smartName = organizeOptions.autoRename
          ? aiEngine.generateSmartFilename(analysis)
          : image.name;

        // Update category count
        categorized[category] = (categorized[category] || 0) + 1;

        // Extract tags from analysis
        const tags: string[] = [category];
        if (analysis.classification) {
          tags.push(...analysis.classification.slice(0, 3).map(c => c.label));
        }
        if (analysis.ocrText && analysis.ocrText.length > 0) {
          tags.push("text");
        }
        if (analysis.faces && analysis.faces.length > 0) {
          tags.push("faces", `${analysis.faces.length}-people`);
        }

        // Update image with analysis results
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  analysis: {
                    ...analysis,
                    // Add compatibility fields
                    confidence: analysis.classification?.[0]?.score || 0.5,
                    dominantColors: analysis.palette || [],
                    duplicateHash: analysis.pHash || "",
                    isNSFW: analysis.nsfw?.some(n => n.probability > 0.7) || false,
                    nsfwScore: analysis.nsfw?.[0]?.probability || 0,
                    text: {
                      text: analysis.ocrText || "",
                      confidence: analysis.ocrText ? 0.8 : 0,
                      words: [],
                    },
                  },
                  category,
                  name: smartName,
                  processed: true,
                  processedAt: new Date(),
                  tags: [...new Set([...img.tags, ...tags])],
                }
              : img
          )
        );

        successful++;
        const processingTime = Date.now() - imageStartTime;
        processingTimes.push(processingTime);
      } catch (error) {
        console.error(`Failed to process ${image.name}:`, error);
        errors++;
        
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  processed: true,
                  processedAt: new Date(),
                  analysis: {
                    id: crypto.randomUUID(),
                    file: img.file,
                    previewUrl: img.url,
                    dimensions: { width: 0, height: 0 },
                    size: img.size / (1024 * 1024),
                    processingTime: 0,
                    timestamp: new Date(),
                    error: `Processing failed: ${error}`,
                  },
                }
              : img
          )
        );
      }

      processed++;

      setStats((prev) => ({
        ...prev,
        processed,
        successful,
        errors,
        categorized,
        avgProcessingTime:
          processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length,
      }));
    }

    // Find duplicates if enabled
    if (organizeOptions.findDuplicates) {
      setProgress((prev) => ({
        ...prev,
        stage: "organization",
        message: "Finding duplicate images...",
      }));

      const processedImagesWithAnalysis = images
        .filter((img) => img.processed && img.analysis)
        .map((img) => ({ id: img.id, analysis: img.analysis! }));

      const duplicateGroups = aiEngine.findSimilarImages(processedImagesWithAnalysis);

      // Generate suggestions for duplicates
      const duplicateSuggestions: SmartSuggestion[] = duplicateGroups.map(
        (group) => ({
          id: crypto.randomUUID(),
          type: "merge",
          confidence: group.similarity,
          description: `Found ${group.group.length} similar images`,
          imageIds: group.group,
          action: async () => {
            const imagesToUpdate = group.group.slice(1);
            setImages((prev) =>
              prev.map((img) =>
                imagesToUpdate.includes(img.id)
                  ? { ...img, category: "duplicates" }
                  : img
              )
            );
          },
        })
      );

      setSuggestions((prev) => [...prev, ...duplicateSuggestions]);
    }

    setProgress({
      current: processed,
      total: unprocessedImages.length,
      status: "complete",
      stage: "complete",
      message: `Successfully processed ${successful} images`,
    });

    setStats((prev) => ({
      ...prev,
      endTime: new Date(),
    }));

    setIsProcessing(false);
  }, [images, isProcessing, organizeOptions]);

  /**
   * Stop processing
   */
  const stopProcessing = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsProcessing(false);
    setProgress((prev) => ({
      ...prev,
      status: "idle",
      message: "Processing stopped",
    }));
  }, []);

  /**
   * Remove an image
   */
  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image?.url) {
        URL.revokeObjectURL(image.url);
      }
      if (image?.thumbnail) {
        URL.revokeObjectURL(image.thumbnail);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  /**
   * Clear all images
   */
  const clearAll = useCallback(() => {
    images.forEach((img) => {
      if (img.url) URL.revokeObjectURL(img.url);
      if (img.thumbnail) URL.revokeObjectURL(img.thumbnail);
    });
    setImages([]);
    setSuggestions([]);
    setProgress({
      current: 0,
      total: 0,
      status: "idle",
      stage: "upload",
      message: "Ready to organize images",
    });
  }, [images]);

  /**
   * Filter images
   */
  const filteredImages = images.filter((image) => {
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(image.category!)
    ) {
      return false;
    }

    if (
      filters.hasText &&
      (!image.analysis?.ocrText || image.analysis.ocrText.length === 0)
    ) {
      return false;
    }

    if (
      filters.hasFaces &&
      (!image.analysis?.faces || image.analysis.faces.length === 0)
    ) {
      return false;
    }

    if (filters.isNSFW !== (image.analysis?.isNSFW || false)) {
      return false;
    }

    if (image.size < filters.minSize || image.size > filters.maxSize) {
      return false;
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        image.name,
        image.analysis?.description || "",
        image.analysis?.ocrText || "",
        ...image.tags,
      ]
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  /**
   * Get images by category
   */
  const getImagesByCategory = useCallback(
    (category: ImageCategory) => {
      return images.filter((img) => img.category === category);
    },
    [images]
  );

  /**
   * Export results as JSON
   */
  const exportResults = useCallback(() => {
    const results = {
      timestamp: new Date().toISOString(),
      stats,
      images: images.map((img) => ({
        name: img.name,
        originalName: img.file.name,
        size: img.size,
        category: img.category,
        tags: img.tags,
        analysis: img.analysis
          ? {
              description: img.analysis.description,
              confidence: img.analysis.confidence,
              isNSFW: img.analysis.isNSFW,
              faceCount: img.analysis.faces?.length || 0,
              textLength: img.analysis.ocrText?.length || 0,
              quality: img.analysis.quality,
              colors: img.analysis.palette,
            }
          : null,
      })),
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `knoux-organizer-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [images, stats]);

  return {
    // State
    images: filteredImages,
    allImages: images,
    progress,
    stats,
    filters,
    organizeOptions,
    suggestions,
    isProcessing,

    // Actions
    addImages,
    processImages,
    stopProcessing,
    removeImage,
    clearAll,
    setFilters,
    setOrganizeOptions,
    getImagesByCategory,
    exportResults,

    // Computed values
    processedCount: images.filter((img) => img.processed).length,
    unprocessedCount: images.filter((img) => !img.processed).length,
    categoryStats: Object.entries(stats.categorized).map(
      ([category, count]) => ({
        category: category as ImageCategory,
        count,
      })
    ),
  };
}
