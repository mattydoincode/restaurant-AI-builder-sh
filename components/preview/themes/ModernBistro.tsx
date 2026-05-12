"use client";

import type { MenuItem, RestaurantData } from "@/lib/schema";
import { SafeImg } from "../SafeImg";
import { MenuList, dishCardClass } from "../MenuList";
import { formatTime, formatPrice } from "@/lib/utils";
import { Instagram, MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernBistroProps {
  data: RestaurantData;
  onDishClick?: (id: string) => void;
}

export function ModernBistro({ data, onDishClick }: ModernBistroProps) {
  return (
    <div
      className="bg-[var(--t-bg)] text-[var(--t-fg)] min-h-full"
      style={{ fontFamily: "var(--t-font-body)" }}
    >
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          <SafeImg
            src={data.heroImageUrl}
            alt={data.name || "Restaurant"}
            className="absolute inset-0 w-full h-full object-cover"
            fallbackClassName="absolute inset-0 w-full h-full bg-stone-800"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
            <p
              className="text-xs uppercase tracking-[0.4em] text-[var(--t-accent)] mb-3"
              style={{ letterSpacing: "0.4em" }}
            >
              {data.cuisine || "Restaurant"} {data.priceLevel ? `· ${data.priceLevel}` : ""}
            </p>
            <h1
              className="text-5xl md:text-7xl font-light tracking-tight mb-4"
              style={{ fontFamily: "var(--t-font-display)" }}
            >
              {data.name || "Your Restaurant"}
            </h1>
            {data.tagline && (
              <p className="text-lg md:text-xl text-[var(--t-muted)] max-w-2xl italic font-light">
                {data.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      {data.story && (
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-3xl md:text-4xl font-light mb-6"
              style={{ fontFamily: "var(--t-font-display)" }}
            >
              <span className="text-[var(--t-accent)]">—</span> Our Story{" "}
              <span className="text-[var(--t-accent)]">—</span>
            </h2>
            <p className="text-[var(--t-muted)] leading-relaxed text-base whitespace-pre-line">
              {data.story}
            </p>
          </div>
        </section>
      )}

      {/* Menu */}
      {data.menu.length > 0 && (
        <section className="py-20 px-6 border-t border-[var(--t-border)]">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-light text-center mb-12"
              style={{ fontFamily: "var(--t-font-display)" }}
            >
              Menu
            </h2>
            <div className="space-y-12">
              {data.menu.map((section) => (
                <div key={section.id}>
                  <h3 className="text-xs uppercase tracking-[0.3em] text-[var(--t-accent)] mb-6 text-center">
                    {section.name}
                  </h3>
                  <MenuList>
                    {section.items.map((item) => (
                      <ModernBistroDishCard
                        key={item.id}
                        item={item}
                        onClick={
                          onDishClick ? () => onDishClick(item.id) : undefined
                        }
                      />
                    ))}
                  </MenuList>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hours + Contact */}
      <section className="py-20 px-6 border-t border-[var(--t-border)]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          {data.hours.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] text-[var(--t-accent)] mb-6">
                Hours
              </h3>
              <dl className="space-y-2">
                {data.hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between text-sm border-b border-[var(--t-border)] pb-2"
                  >
                    <dt className="text-[var(--t-fg)] font-medium">{h.day}</dt>
                    <dd className="text-[var(--t-muted)] tabular-nums">
                      {h.closed
                        ? "Closed"
                        : `${formatTime(h.open)} – ${formatTime(h.close)}`}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {(data.contact.address ||
            data.contact.phone ||
            data.contact.email ||
            data.contact.instagram) && (
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] text-[var(--t-accent)] mb-6">
                Visit Us
              </h3>
              <ul className="space-y-3 text-sm">
                {data.contact.address && (
                  <li className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-[var(--t-accent)] flex-shrink-0" />
                    <span className="text-[var(--t-muted)]">
                      {data.contact.address}
                    </span>
                  </li>
                )}
                {data.contact.phone && (
                  <li className="flex items-start gap-3">
                    <Phone className="h-4 w-4 mt-0.5 text-[var(--t-accent)] flex-shrink-0" />
                    <a
                      href={`tel:${data.contact.phone}`}
                      className="text-[var(--t-muted)] hover:text-[var(--t-fg)]"
                    >
                      {data.contact.phone}
                    </a>
                  </li>
                )}
                {data.contact.email && (
                  <li className="flex items-start gap-3">
                    <Mail className="h-4 w-4 mt-0.5 text-[var(--t-accent)] flex-shrink-0" />
                    <a
                      href={`mailto:${data.contact.email}`}
                      className="text-[var(--t-muted)] hover:text-[var(--t-fg)] break-all"
                    >
                      {data.contact.email}
                    </a>
                  </li>
                )}
                {data.contact.instagram && (
                  <li className="flex items-start gap-3">
                    <Instagram className="h-4 w-4 mt-0.5 text-[var(--t-accent)] flex-shrink-0" />
                    <span className="text-[var(--t-muted)]">
                      {data.contact.instagram}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--t-border)] py-8 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--t-muted)]">
          {data.name || "Restaurant"} · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

function ModernBistroDishCard({
  item,
  onClick,
}: {
  item: MenuItem;
  onClick?: () => void;
}) {
  const interactive = Boolean(onClick);
  const Comp = (interactive ? "button" : "div") as "button" | "div";

  return (
    <Comp
      type={interactive ? "button" : undefined}
      onClick={onClick}
      className={cn(
        dishCardClass,
        "flex items-start gap-4 text-left pb-4 border-b border-[var(--t-border)] last:border-b-0 max-md:bg-[var(--t-card)] max-md:border max-md:rounded-lg max-md:p-3 w-full",
        interactive &&
          "group cursor-pointer transition-colors hover:text-[var(--t-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--t-accent)]",
      )}
    >
      {item.imageUrl && (
        <SafeImg
          src={item.imageUrl}
          alt={item.name}
          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded flex-shrink-0"
          fallbackClassName="w-20 h-20 md:w-24 md:h-24 rounded flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-3">
          <div className="flex items-baseline gap-2 flex-wrap min-w-0">
            <h4
              className="font-medium"
              style={{ fontFamily: "var(--t-font-display)" }}
            >
              {item.name}
            </h4>
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 border border-[var(--t-border)] text-[var(--t-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          {item.price && (
            <span
              className="text-[var(--t-accent)] font-medium tabular-nums flex-shrink-0"
              style={{ fontFamily: "var(--t-font-display)" }}
            >
              {formatPrice(item.price)}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-[var(--t-muted)] mt-1 italic">
            {item.description}
          </p>
        )}
        {interactive && (
          <span className="hidden md:inline-flex items-center gap-1 mt-1 text-xs text-[var(--t-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
            View details <ChevronRight className="h-3 w-3" />
          </span>
        )}
      </div>
    </Comp>
  );
}
