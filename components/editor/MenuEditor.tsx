"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Trash2, GripVertical, ChevronRight, ImagePlus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DIETARY_TAGS, type MenuItem, type MenuSection } from "@/lib/schema";
import { cn, formatPrice } from "@/lib/utils";
import { SafeImg } from "@/components/preview/SafeImg";
import { ImagePickerDialog } from "./ImagePickerDialog";
import { AIAssistButton } from "./AIAssistButton";

/**
 * True if the event originated from a real <button> descendant (the grip,
 * trash, etc.). Used to skip expand-on-click when the user clicks an inner
 * button, including after a keyboard drag where dnd-kit's final Space would
 * otherwise bubble up and toggle expand.
 */
function isInnerInteractive(e: React.SyntheticEvent): boolean {
  const target = e.target as Element | null;
  if (!target) return false;
  return target.closest("button") !== null;
}

export function MenuEditor() {
  const data = useStore((s) => s.data);
  const addSection = useStore((s) => s.addMenuSection);
  const reorderSections = useStore((s) => s.reorderMenuSections);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (data.menu.length === 0) {
    return (
      <div className="text-center py-8 px-4 border-2 border-dashed border-stone-200 rounded-lg">
        <p className="text-sm text-stone-500 mb-3">No menu sections yet.</p>
        <Button
          type="button"
          variant="brand"
          size="sm"
          onClick={() => addSection("Appetizers")}
        >
          <Plus className="h-3.5 w-3.5" />
          Add your first section
        </Button>
      </div>
    );
  }

  const handleSectionsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = data.menu.findIndex((s) => s.id === active.id);
    const to = data.menu.findIndex((s) => s.id === over.id);
    if (from !== -1 && to !== -1) reorderSections(from, to);
  };

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionsDragEnd}
      >
        <SortableContext
          items={data.menu.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {data.menu.map((section) => (
            <SortableSection key={section.id} section={section} />
          ))}
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addSection()}
        className="w-full"
      >
        <Plus className="h-3.5 w-3.5" />
        Add section
      </Button>
    </div>
  );
}

function SortableSection({ section }: { section: MenuSection }) {
  const renameSection = useStore((s) => s.renameMenuSection);
  const removeSection = useStore((s) => s.removeMenuSection);
  const addItem = useStore((s) => s.addMenuItem);
  const reorderItems = useStore((s) => s.reorderMenuItems);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : "auto",
    opacity: isDragging ? 0.7 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleItemsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = section.items.findIndex((i) => i.id === active.id);
    const to = section.items.findIndex((i) => i.id === over.id);
    if (from !== -1 && to !== -1) reorderItems(section.id, from, to);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border border-stone-200 rounded-lg p-3 bg-white",
        isDragging && "shadow-lg ring-2 ring-stone-300",
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-grab active:cursor-grabbing touch-none"
          aria-label={`Drag section ${section.name}`}
          title="Drag to reorder section"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <Input
          value={section.name}
          onChange={(e) => renameSection(section.id, e.target.value)}
          className="font-semibold border-transparent shadow-none hover:border-stone-200 focus-visible:border-stone-300 px-2"
          placeholder="Section name"
        />
        <AIAssistButton
          fieldKind="section_name"
          current={section.name}
          onResult={(value) => renameSection(section.id, value)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeSection(section.id)}
          aria-label="Remove section"
        >
          <Trash2 className="h-3.5 w-3.5 text-stone-400 hover:text-red-600" />
        </Button>
      </div>

      <div className="pl-6 space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleItemsDragEnd}
        >
          <SortableContext
            items={section.items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {section.items.map((item) => (
              <SortableItem
                key={item.id}
                sectionId={section.id}
                item={item}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => addItem(section.id)}
          className="w-full justify-start"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </Button>
      </div>
    </div>
  );
}

function SortableItem({
  sectionId,
  item,
}: {
  sectionId: string;
  item: MenuItem;
}) {
  const updateItem = useStore((s) => s.updateMenuItem);
  const removeItem = useStore((s) => s.removeMenuItem);
  const [expanded, setExpanded] = useState(false);
  const [primaryPickerOpen, setPrimaryPickerOpen] = useState(false);
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : "auto",
    opacity: isDragging ? 0.6 : 1,
  };

  const displayName = item.name.trim() || (
    <span className="text-stone-400 italic">Untitled item</span>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border border-stone-100 rounded-md bg-white overflow-hidden",
        isDragging && "shadow-xl ring-2 ring-brand-300",
        expanded && "bg-stone-50/50",
      )}
    >
      {/* Header strip (always visible, click to toggle expand) */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={(e) => {
          if (isInnerInteractive(e)) return;
          setExpanded((v) => !v);
        }}
        onKeyDown={(e) => {
          if (isInnerInteractive(e)) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
        className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-stone-50 cursor-pointer select-none"
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded text-stone-300 hover:text-stone-600 hover:bg-stone-100 cursor-grab active:cursor-grabbing touch-none"
          aria-label={`Drag item ${item.name || "Untitled"}`}
          title="Drag to reorder item"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 text-stone-400 flex-shrink-0 transition-transform",
            expanded && "rotate-90",
          )}
        />
        {item.imageUrl ? (
          <SafeImg
            src={item.imageUrl}
            alt=""
            className="h-7 w-7 rounded object-cover border border-stone-200 flex-shrink-0"
            fallbackClassName="h-7 w-7 rounded border border-stone-200 flex-shrink-0"
          />
        ) : null}
        <span className="flex-1 min-w-0 text-sm font-medium text-stone-900 truncate">
          {displayName}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600"
            >
              {tag}
            </span>
          ))}
        </div>
        {item.price && (
          <span className="text-xs text-stone-500 tabular-nums flex-shrink-0">
            {formatPrice(item.price)}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeItem(sectionId, item.id);
          }}
          aria-label="Remove item"
          className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Expanded edit body */}
      {expanded && (
        <div className="px-3 pb-3 pt-1 space-y-2 animate-fade-in border-t border-stone-100">
          <div className="flex gap-1.5 items-center">
            <Input
              value={item.name}
              onChange={(e) =>
                updateItem(sectionId, item.id, { name: e.target.value })
              }
              placeholder="Item name"
              className="flex-1"
              autoFocus
            />
            <AIAssistButton
              fieldKind="dish_name"
              current={item.name}
              dishName={item.name}
              onResult={(value) =>
                updateItem(sectionId, item.id, { name: value })
              }
            />
            <Input
              value={item.price}
              onChange={(e) =>
                updateItem(sectionId, item.id, { price: e.target.value })
              }
              placeholder="$12"
              className="w-20"
            />
          </div>
          <div className="relative">
            <Textarea
              value={item.description}
              onChange={(e) =>
                updateItem(sectionId, item.id, {
                  description: e.target.value,
                })
              }
              placeholder="Description (ingredients, preparation)"
              rows={2}
              className="text-xs pr-8"
            />
            <div className="absolute top-1 right-1">
              <AIAssistButton
                fieldKind="dish_description"
                current={item.description}
                dishName={item.name}
                onResult={(value) =>
                  updateItem(sectionId, item.id, { description: value })
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {DIETARY_TAGS.map((tag) => {
              const active = item.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    updateItem(sectionId, item.id, {
                      tags: active
                        ? item.tags.filter((t) => t !== tag)
                        : [...item.tags, tag],
                    })
                  }
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors",
                    active
                      ? "bg-brand-600 border-brand-600 text-white"
                      : "bg-white border-stone-200 text-stone-500 hover:border-stone-300",
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-100 space-y-2">
            <Label className="text-xs">Dish image</Label>
            <div className="flex items-center gap-2">
              {item.imageUrl ? (
                <SafeImg
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-14 w-20 rounded object-cover border border-stone-200"
                  fallbackClassName="h-14 w-20 rounded border border-stone-200"
                />
              ) : (
                <div className="h-14 w-20 rounded border border-dashed border-stone-300 flex items-center justify-center text-stone-400">
                  <ImagePlus className="h-4 w-4" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setPrimaryPickerOpen(true)}
                >
                  {item.imageUrl ? "Change" : "Add image"}
                </Button>
                {item.imageUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateItem(sectionId, item.id, { imageUrl: "" })
                    }
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs">Chef (optional)</Label>
            <div className="flex gap-1.5 items-center">
              <Input
                value={item.chef}
                onChange={(e) =>
                  updateItem(sectionId, item.id, { chef: e.target.value })
                }
                placeholder="e.g. Chef Marta Russo"
                className="text-xs flex-1"
              />
              <AIAssistButton
                fieldKind="chef"
                current={item.chef}
                dishName={item.name}
                onResult={(value) =>
                  updateItem(sectionId, item.id, { chef: value })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">
              Gallery ({item.gallery.length}/6)
            </Label>
            <div className="flex flex-wrap gap-2">
              {item.gallery.map((src, idx) => (
                <div key={`${src}-${idx}`} className="relative group">
                  <SafeImg
                    src={src}
                    alt={`Gallery ${idx + 1}`}
                    className="h-14 w-20 rounded object-cover border border-stone-200"
                    fallbackClassName="h-14 w-20 rounded border border-stone-200"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateItem(sectionId, item.id, {
                        gallery: item.gallery.filter((_, i) => i !== idx),
                      })
                    }
                    className="absolute -top-1.5 -right-1.5 bg-white border border-stone-200 rounded-full p-0.5 shadow-sm text-stone-500 hover:text-red-600 transition-colors"
                    aria-label="Remove gallery image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {item.gallery.length < 6 && (
                <button
                  type="button"
                  onClick={() => setGalleryPickerOpen(true)}
                  className="h-14 w-20 rounded border-2 border-dashed border-stone-300 text-stone-400 hover:border-brand-400 hover:text-brand-500 flex flex-col items-center justify-center gap-0.5 transition-colors"
                  aria-label="Add gallery image"
                >
                  <ImagePlus className="h-4 w-4" />
                  <span className="text-[10px] font-medium">Add</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <ImagePickerDialog
        open={primaryPickerOpen}
        onOpenChange={setPrimaryPickerOpen}
        value={item.imageUrl}
        onSelect={(src) =>
          updateItem(sectionId, item.id, { imageUrl: src })
        }
        title="Choose dish image"
        tabs={["upload", "url"]}
      />
      <ImagePickerDialog
        open={galleryPickerOpen}
        onOpenChange={setGalleryPickerOpen}
        onSelect={(src) =>
          updateItem(sectionId, item.id, {
            gallery: [...item.gallery, src].slice(0, 6),
          })
        }
        title="Add gallery image"
        tabs={["upload", "url"]}
      />
    </div>
  );
}
