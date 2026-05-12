"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Link as LinkIcon, ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SafeImg } from "@/components/preview/SafeImg";
import { isIDBAvailable, putImage } from "@/lib/imageStore";
import { STOCK_HERO_IMAGES } from "@/lib/sample";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = /^image\//;

export type ImagePickerTab = "upload" | "url" | "stock";

interface ImagePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Initial value to pre-fill / highlight. */
  value?: string;
  /** Called with the chosen `src` (idb:<id>, http URL, etc.) when user confirms. */
  onSelect: (src: string) => void;
  /** Which tabs to show. Defaults to all three for hero, [upload, url] for dishes. */
  tabs?: ImagePickerTab[];
  /** Dialog title. */
  title?: string;
  /** Whether stock photos are shown (only used if tabs includes "stock"). */
  stockImages?: string[];
}

export function ImagePickerDialog({
  open,
  onOpenChange,
  value,
  onSelect,
  tabs = ["upload", "url", "stock"],
  title = "Choose image",
  stockImages = STOCK_HERO_IMAGES,
}: ImagePickerDialogProps) {
  const recentImageUrls = useStore((s) => s.data.recentImageUrls);
  const pushRecent = useStore((s) => s.pushRecentImageUrl);

  const [activeTab, setActiveTab] = useState<ImagePickerTab>(tabs[0]);
  const [pending, setPending] = useState<string>("");
  const [urlInput, setUrlInput] = useState<string>("");
  const [urlPreviewOk, setUrlPreviewOk] = useState<boolean | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const idbAvailable = isIDBAvailable();

  useEffect(() => {
    if (!open) return;
    setPending(value ?? "");
    setUrlInput(value && !value.startsWith("idb:") ? value : "");
    setUrlPreviewOk(null);
    setUploadError(null);
    setActiveTab(tabs[0]);
  }, [open, value, tabs]);

  const handleFile = useCallback(
    async (file: File | null | undefined) => {
      if (!file) return;
      setUploadError(null);
      if (!ACCEPTED_TYPES.test(file.type)) {
        setUploadError("Please choose an image file.");
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        setUploadError("Image is larger than 5 MB.");
        return;
      }
      if (!idbAvailable) {
        setUploadError(
          "Your browser blocked local image storage. Use the URL tab instead.",
        );
        return;
      }
      setUploading(true);
      try {
        const ref = await putImage(file);
        setPending(ref);
      } catch (err) {
        console.error(err);
        setUploadError("Could not save the image locally. Try the URL tab.");
      } finally {
        setUploading(false);
      }
    },
    [idbAvailable],
  );

  const onConfirm = () => {
    if (!pending) {
      toast.error("Choose an image first");
      return;
    }
    if (!pending.startsWith("idb:")) {
      pushRecent(pending);
    }
    onSelect(pending);
    onOpenChange(false);
  };

  const recent = (recentImageUrls ?? []).slice(0, 6);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Upload from your computer, paste a URL, or pick a stock photo."
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex gap-1 border-b border-stone-200">
          {tabs.includes("upload") && (
            <TabButton
              icon={<Upload className="h-3.5 w-3.5" />}
              label="Upload"
              active={activeTab === "upload"}
              onClick={() => setActiveTab("upload")}
            />
          )}
          {tabs.includes("url") && (
            <TabButton
              icon={<LinkIcon className="h-3.5 w-3.5" />}
              label="From URL"
              active={activeTab === "url"}
              onClick={() => setActiveTab("url")}
            />
          )}
          {tabs.includes("stock") && (
            <TabButton
              icon={<ImageIcon className="h-3.5 w-3.5" />}
              label="Stock"
              active={activeTab === "stock"}
              onClick={() => setActiveTab("stock")}
            />
          )}
        </div>

        {activeTab === "upload" && (
          <UploadTab
            onFile={handleFile}
            uploading={uploading}
            error={uploadError}
            fileInputRef={fileInputRef}
            disabled={!idbAvailable}
          />
        )}

        {activeTab === "url" && (
          <UrlTab
            urlInput={urlInput}
            setUrlInput={(v) => {
              setUrlInput(v);
              setUrlPreviewOk(null);
            }}
            onPreview={() => {
              if (!urlInput.trim()) return;
              setPending(urlInput.trim());
              setUrlPreviewOk(null);
            }}
            previewSrc={pending && !pending.startsWith("idb:") ? pending : ""}
            previewOk={urlPreviewOk}
            setPreviewOk={setUrlPreviewOk}
          />
        )}

        {activeTab === "stock" && (
          <StockTab
            stockImages={stockImages}
            recent={recent}
            selected={pending}
            onPick={(src) => setPending(src)}
          />
        )}

        <div className="border-t border-stone-200 pt-4">
          <Label className="mb-2 block">Current selection</Label>
          {pending ? (
            <div className="flex items-center gap-3">
              <SafeImg
                src={pending}
                alt="Selected"
                className="w-28 h-20 object-cover rounded-md border border-stone-200"
                fallbackClassName="w-28 h-20 rounded-md border border-stone-200"
              />
              <div className="text-xs text-stone-500 break-all line-clamp-3">
                {pending.startsWith("idb:")
                  ? "Local upload"
                  : pending}
              </div>
            </div>
          ) : (
            <div className="text-sm text-stone-400">No image picked yet.</div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={!pending}>
            Use this image
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
        active
          ? "border-stone-900 text-stone-900"
          : "border-transparent text-stone-500 hover:text-stone-700",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function UploadTab({
  onFile,
  uploading,
  error,
  fileInputRef,
  disabled,
}: {
  onFile: (file: File | null | undefined) => void;
  uploading: boolean;
  error: string | null;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  disabled: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          if (disabled) return;
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (disabled) return;
          const file = e.dataTransfer.files?.[0];
          onFile(file);
        }}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragging
            ? "border-brand-500 bg-brand-50"
            : "border-stone-300 bg-stone-50",
          disabled && "opacity-60",
        )}
      >
        <Upload className="h-6 w-6 mx-auto text-stone-400 mb-2" />
        <p className="text-sm text-stone-600">
          {dragging
            ? "Drop the image here"
            : "Drag and drop an image, or click to browse"}
        </p>
        <p className="text-xs text-stone-400 mt-1">
          PNG, JPG, WebP up to 5 MB
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3"
          disabled={disabled || uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "Uploading..." : "Choose file"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            onFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && (
        <div className="flex items-start gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {disabled && !error && (
        <div className="flex items-start gap-1.5 text-xs text-amber-600">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Local image storage is unavailable in this browser. Use the URL tab
            instead.
          </span>
        </div>
      )}
    </div>
  );
}

function UrlTab({
  urlInput,
  setUrlInput,
  onPreview,
  previewSrc,
  previewOk,
  setPreviewOk,
}: {
  urlInput: string;
  setUrlInput: (v: string) => void;
  onPreview: () => void;
  previewSrc: string;
  previewOk: boolean | null;
  setPreviewOk: (v: boolean | null) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onPreview();
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={onPreview}>
          Preview
        </Button>
      </div>
      {previewSrc && (
        <div className="relative aspect-video rounded-md overflow-hidden border border-stone-200 bg-stone-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt="URL preview"
            className="w-full h-full object-cover"
            onLoad={() => setPreviewOk(true)}
            onError={() => setPreviewOk(false)}
          />
          {previewOk === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-xs text-red-600">
              Could not load image from this URL
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StockTab({
  stockImages,
  recent,
  selected,
  onPick,
}: {
  stockImages: string[];
  recent: string[];
  selected: string;
  onPick: (src: string) => void;
}) {
  return (
    <div className="space-y-4">
      {recent.length > 0 && (
        <div>
          <Label className="mb-2 block">Recent</Label>
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
            {recent.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => onPick(src)}
                className={cn(
                  "relative shrink-0 w-24 aspect-video rounded-md overflow-hidden border-2 transition-colors",
                  selected === src
                    ? "border-brand-500"
                    : "border-transparent hover:border-stone-300",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Recent"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <Label className="mb-2 block">Stock photos</Label>
        <div className="grid grid-cols-3 gap-2">
          {stockImages.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => onPick(src)}
              className={cn(
                "relative aspect-video overflow-hidden rounded-md border-2 transition-colors",
                selected === src
                  ? "border-brand-500"
                  : "border-transparent hover:border-stone-300",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Stock photo"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
