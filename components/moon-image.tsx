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

interface MoonImageProps {
  moonNumber: number;
  nextMooniversaryNumber: number;
}

export function MoonImage({
  moonNumber,
  nextMooniversaryNumber,
}: MoonImageProps) {
  const [hasImage, setHasImage] = React.useState<boolean | null>(null);
  const [showUpload, setShowUpload] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [imageKey, setImageKey] = React.useState(0);
  const [isImageLoading, setIsImageLoading] = React.useState(false);

  const thumbnailUrl = `/api/images/${moonNumber}/thumbnail?v=${imageKey}`;
  const fullImageUrl = `/api/images/${moonNumber}?v=${imageKey}`;

  const isUploadAllowed = moonNumber <= nextMooniversaryNumber;

  React.useEffect(() => {
    const checkImage = async () => {
      // Don't attempt to load images for future moons
      if (moonNumber > nextMooniversaryNumber) {
        setHasImage(false);
        setIsImageLoading(false);
        return;
      }

      setIsImageLoading(true);
      try {
        const response = await fetch(thumbnailUrl);

        if (response.ok) {
          setHasImage(true);
        } else {
          setHasImage(false);
          setIsImageLoading(false);
        }
      } catch {
        setHasImage(false);
        setIsImageLoading(false);
      }
    };
    checkImage();

    return () => {
      setIsImageLoading(false);
    };
  }, [moonNumber, thumbnailUrl, nextMooniversaryNumber]);

  const handleImageError = () => {
    setIsImageLoading(false);
    setHasImage(false);
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
      if (selectedFile.size > 10 * 1024 * 1024) {
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

      setImageKey((prev) => prev + 1);
      setHasImage(true);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && file && password && !isUploading) {
      handleUpload();
    }
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
                    <div className="w-full h-full cursor-pointer border border-white/20 rounded-lg overflow-hidden hover:border-white/40 transition-colors">
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
                      <Image
                        key={imageKey}
                        src={thumbnailUrl}
                        alt={`Moon ${moonNumber}`}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                        unoptimized
                        onLoad={handleImageLoad}
                        loading="eager"
                        onError={handleImageError}
                      />
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
                      <Image
                        src={fullImageUrl}
                        alt={`Moon ${moonNumber} full`}
                        width={1200}
                        height={1200}
                        className="w-full h-auto object-contain rounded-lg"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                        unoptimized
                        loading="eager"
                      />
                      <DialogClose asChild>
                        <Button className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 border border-white/30 text-white rounded-full p-2 h-auto w-auto backdrop-blur-sm">
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

            <Button
              onClick={() => setShowUpload(true)}
              disabled={!isUploadAllowed}
              className="border border-white/20 text-white hover:bg-white/10 hover:border-white/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-4 w-4 mr-2" />
              {hasImage ? "Replace cute pic" : "Add cute pic"}
            </Button>
          </div>
        ) : (
          <div className="border border-white/20 rounded-lg p-3 space-y-2 w-full max-w-[280px]">
            <div className="flex justify-between items-center">
              <span className="text-white/90 text-sm">Upload cute pic</span>
              <Button
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
                onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
              className="border-white/20 text-white placeholder:text-white/50 focus:border-white/40 text-sm h-8"
            />

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <Button
              onClick={handleUpload}
              disabled={!file || !password || isUploading}
              className="w-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 disabled:opacity-50 text-sm h-8"
            >
              {isUploading ? "Sending..." : "Send it to the moon"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
