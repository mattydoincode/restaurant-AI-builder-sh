"use client";

import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DIETARY_TAGS } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { Plus, Trash2, GripVertical } from "lucide-react";

export function MenuEditor() {
  const data = useStore((s) => s.data);
  const addSection = useStore((s) => s.addMenuSection);
  const removeSection = useStore((s) => s.removeMenuSection);
  const renameSection = useStore((s) => s.renameMenuSection);
  const addItem = useStore((s) => s.addMenuItem);
  const updateItem = useStore((s) => s.updateMenuItem);
  const removeItem = useStore((s) => s.removeMenuItem);

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

  return (
    <div className="space-y-4">
      {data.menu.map((section) => (
        <div
          key={section.id}
          className="border border-stone-200 rounded-lg p-3 bg-white"
        >
          <div className="flex items-center gap-2 mb-3">
            <GripVertical className="h-4 w-4 text-stone-300 flex-shrink-0" />
            <Input
              value={section.name}
              onChange={(e) => renameSection(section.id, e.target.value)}
              className="font-semibold border-transparent shadow-none hover:border-stone-200 focus-visible:border-stone-300 px-2"
              placeholder="Section name"
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

          <div className="space-y-3 pl-6">
            {section.items.map((item) => (
              <div
                key={item.id}
                className="border border-stone-100 rounded-md p-3 bg-stone-50/50 space-y-2"
              >
                <div className="flex gap-2">
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      updateItem(section.id, item.id, {
                        name: e.target.value,
                      })
                    }
                    placeholder="Item name"
                    className="flex-1"
                  />
                  <Input
                    value={item.price}
                    onChange={(e) =>
                      updateItem(section.id, item.id, {
                        price: e.target.value,
                      })
                    }
                    placeholder="$12"
                    className="w-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(section.id, item.id)}
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-stone-400 hover:text-red-600" />
                  </Button>
                </div>
                <Textarea
                  value={item.description}
                  onChange={(e) =>
                    updateItem(section.id, item.id, {
                      description: e.target.value,
                    })
                  }
                  placeholder="Description (ingredients, preparation)"
                  rows={2}
                  className="text-xs"
                />
                <div className="flex flex-wrap gap-1">
                  {DIETARY_TAGS.map((tag) => {
                    const active = item.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          updateItem(section.id, item.id, {
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
              </div>
            ))}
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
      ))}
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
