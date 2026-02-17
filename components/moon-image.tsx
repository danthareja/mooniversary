"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer, Upload, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const imageListCache = new Map<string, string[]>();

interface MoonImageProps {
  moonNumber: number;
  nextMooniversaryNumber: number;
}

export function MoonImage({
  moonNumber,
  nextMooniversaryNumber,
}: MoonImageProps) {
  const [images, setImages] = React.useState<string[]>([]);
  const hasImage = images.length > 0;
  const [showUpload, setShowUpload] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [imageKey, setImageKey] = React.useState(0);
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const [carouselApi, setCarouselApi] = React.useState<CarouselApi | undefined>(
    undefined,
  );
  // currentIndex is used to sync between thumbnail and expanded view

  const isUploadAllowed = moonNumber <= nextMooniversaryNumber;

  const fetchImageList = React.useCallback(
    async (moon: number): Promise<string[]> => {
      const cacheKey = `${moon}:${imageKey}`;
      const cached = imageListCache.get(cacheKey);
      if (cached) return cached;

      const res = await fetch(`/api/images/${moon}/list?v=${imageKey}`);
      const data = await res.json();
      const list: string[] = Array.isArray(data.images) ? data.images : [];
      imageListCache.set(cacheKey, list);
      return list;
    },
    [imageKey],
  );

  const refreshImages = React.useCallback(async () => {
    if (moonNumber > nextMooniversaryNumber) {
      setImages([]);
      setIsImageLoading(false);
      return;
    }
    try {
      const list = await fetchImageList(moonNumber);
      setImages(list);
      setCurrentIndex((prev) =>
        list.length === 0 ? 0 : Math.min(prev, list.length - 1),
      );
    } catch {
      setImages([]);
    } finally {
      setIsImageLoading(false);
    }
  }, [moonNumber, nextMooniversaryNumber, fetchImageList]);

  React.useEffect(() => {
    setIsImageLoading(true);
    refreshImages();
    return () => {
      setIsImageLoading(false);
    };
  }, [refreshImages]);

  // Preload adjacent mooniversary image lists and thumbnails
  React.useEffect(() => {
    const adjacent = [moonNumber - 1, moonNumber + 1].filter(
      (n) => n >= 1 && n <= nextMooniversaryNumber,
    );
    adjacent.forEach(async (n) => {
      try {
        const list = await fetchImageList(n);
        // Preload thumbnail images into browser cache
        list.forEach((id) => {
          const img = new window.Image();
          img.src = `/api/images/${n}/thumbnail?id=${id}&v=${imageKey}`;
        });
      } catch {
        // Preloading is best-effort
      }
    });
  }, [moonNumber, nextMooniversaryNumber, fetchImageList, imageKey]);

  React.useEffect(() => {
    if (!carouselApi) return;
    setCurrentIndex(carouselApi.selectedScrollSnap());
    const onSelect = () => setCurrentIndex(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
  }, [carouselApi]);

  // Keep thumbnail carousel in sync when currentIndex changes (e.g. from expanded view)
  React.useEffect(() => {
    if (carouselApi && carouselApi.selectedScrollSnap() !== currentIndex) {
      carouselApi.scrollTo(currentIndex);
    }
  }, [carouselApi, currentIndex]);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Scroll to the correct image when dialog opens or currentIndex changes externally
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const targetScroll = currentIndex * container.clientWidth;
    if (Math.abs(container.scrollLeft - targetScroll) > 1) {
      container.scrollTo({ left: targetScroll, behavior: "instant" });
    }
  }, [currentIndex, images]);

  const handleImageError = () => {
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("File must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !password) {
      setError("Please select a file and enter password");
      return;
    }

    if (!isUploadAllowed) {
      setError(
        "Images can only be uploaded for the current and previous moons",
      );
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("password", password);
      formData.append("moonNumber", moonNumber.toString());

      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      imageListCache.delete(`${moonNumber}:${imageKey}`);
      setImageKey((prev) => prev + 1);
      setShowUpload(false);
      setFile(null);
      setPassword("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setShowUpload(false);
    setFile(null);
    setPassword("");
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpload();
  };

  React.useEffect(() => {
    resetUpload();
  }, [moonNumber]);

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <div className="w-full h-[280px] flex flex-col items-center justify-center">
        {!showUpload ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-[200px] h-[200px] relative">
              {hasImage ? (
                <Dialog>
                  <DialogTitle className="sr-only">
                    Image for Moon {moonNumber}
                  </DialogTitle>
                  <DialogTrigger asChild>
                    <div className="group w-full h-full cursor-pointer border border-white/20 rounded-lg overflow-hidden hover:border-white/40 transition-colors relative focus:outline-none focus:ring-1 focus:ring-white/30">
                      {isImageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                          <svg
                            className="animate-spin h-8 w-8 text-white/60"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                        </div>
                      )}
                      <Carousel
                        setApi={setCarouselApi}
                        className="w-[200px] h-[200px]"
                      >
                        <CarouselContent className="-ml-0">
                          {images.map((id) => (
                            <CarouselItem
                              key={`${id}-${imageKey}`}
                              className="pl-0"
                            >
                              <div
                                tabIndex={0}
                                className="relative h-[200px] w-[200px] outline-none"
                              >
                                <Image
                                  src={`/api/images/${moonNumber}/thumbnail?id=${id}&v=${imageKey}`}
                                  alt={`Moon ${moonNumber}`}
                                  width={200}
                                  height={200}
                                  className="object-cover w-full h-full"
                                  unoptimized
                                  loading="eager"
                                  onLoad={handleImageLoad}
                                  onError={handleImageError}
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {images.length > 1 && (
                          <>
                            <CarouselPrevious className="left-1 top-1/2 -translate-y-1/2" />
                            <CarouselNext className="right-1 top-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                              {images.map((_, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  aria-label={`Go to image ${idx + 1}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    carouselApi?.scrollTo(idx);
                                  }}
                                  className={`h-2.5 w-2.5 rounded-full ${idx === currentIndex ? "bg-white" : "bg-white/50"} shadow-sm`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </Carousel>
                    </div>
                  </DialogTrigger>
                  <DialogContent
                    className="max-w-4xl border-none p-0 bg-black/90"
                    showCloseButton={false}
                  >
                    <DialogDescription className="sr-only">
                      Image for Moon {moonNumber}
                    </DialogDescription>
                    <div className="relative">
                      <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto hide-scrollbar"
                        style={{
                          scrollSnapType: "x mandatory",
                          WebkitOverflowScrolling: "touch",
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                        onScroll={(e) => {
                          const container = e.currentTarget;
                          const newIndex = Math.round(
                            container.scrollLeft / container.clientWidth,
                          );
                          if (
                            newIndex !== currentIndex &&
                            newIndex >= 0 &&
                            newIndex < images.length
                          ) {
                            setCurrentIndex(newIndex);
                          }
                        }}
                      >
                        {images.map((id) => (
                          <div
                            key={id}
                            className="flex-none w-full flex items-center justify-center"
                            style={{
                              scrollSnapAlign: "center",
                              minHeight: "50vh",
                            }}
                          >
                            <Image
                              src={`/api/images/${moonNumber}?id=${id}&v=${imageKey}`}
                              alt={`Moon ${moonNumber} full`}
                              width={1200}
                              height={1200}
                              className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
                              unoptimized
                              loading="eager"
                            />
                          </div>
                        ))}
                      </div>
                      {images.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              aria-label={`Go to image ${idx + 1}`}
                              onClick={() => {
                                setCurrentIndex(idx);
                                scrollContainerRef.current?.scrollTo({
                                  left:
                                    idx *
                                    (scrollContainerRef.current?.clientWidth ??
                                      0),
                                  behavior: "smooth",
                                });
                              }}
                              className={`h-2.5 w-2.5 rounded-full ${idx === currentIndex ? "bg-white" : "bg-white/50"} shadow-sm`}
                            />
                          ))}
                        </div>
                      )}
                      <DialogClose asChild>
                        <Button className="absolute top-4 right-4 size-8 rounded-full bg-white/80 hover:bg-white text-black shadow-none focus:outline-none focus:ring-0">
                          <X className="h-5 w-5" />
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="w-full h-full border border-white/20 border-dashed rounded-lg flex items-center justify-center">
                  {isImageLoading ? (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <svg
                        className="animate-spin h-8 w-8 text-white/60 mx-auto mb-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <p className="text-white/60 text-sm">Loading...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      {!isUploadAllowed ? (
                        <Timer className="h-8 w-8 text-white/40 mx-auto mb-2" />
                      ) : (
                        <Upload className="h-8 w-8 text-white/40 mx-auto mb-2" />
                      )}
                      <p className="text-white/60 text-sm">
                        {!isUploadAllowed
                          ? "Soon my kakes ;)"
                          : "No cute pic yet :("}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setShowUpload(true);
                }}
                disabled={!isUploadAllowed}
                className="border border-white/20 text-white hover:bg-white/10 hover:border-white/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-4 w-4 mr-2" />
                Add cute pic
              </Button>
            </div>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="border border-white/20 rounded-lg p-3 space-y-2 w-full max-w-[280px]"
          >
            <div className="flex justify-between items-center">
              <span className="text-white/90 text-sm">Upload cute pic</span>
              <Button
                type="button"
                onClick={resetUpload}
                className="border-none text-white/60 hover:text-white p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="border-white/20 text-white file:border-0 file:text-white/70 focus:border-white/40 text-xs h-8"
              />
              {file && (
                <p className="text-white/70 text-xs truncate">{file.name}</p>
              )}
            </div>

            <Input
              type="password"
              placeholder="Super secret password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-white/20 text-white placeholder:text-white/50 focus:border-white/40 text-sm h-8"
            />

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <Button
              type="submit"
              disabled={!file || !password || isUploading}
              className="w-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 disabled:opacity-50 text-sm h-8"
            >
              {isUploading ? "Sending..." : "Send it to the moon"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
