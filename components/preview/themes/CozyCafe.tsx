"use client";

import type { RestaurantData } from "@/lib/schema";
import { SafeImg } from "../SafeImg";
import { formatTime, formatPrice } from "@/lib/utils";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";

export function CozyCafe({ data }: { data: RestaurantData }) {
  return (
    <div className="theme-cozyCafe bg-[var(--t-bg)] text-[var(--t-fg)] min-h-full">
      {/* Top bar */}
      <header className="border-b border-[var(--t-border)] bg-[var(--t-card)] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--t-font-display)" }}
          >
            {data.name || "Your Restaurant"}
          </h1>
          {data.cuisine && (
            <span className="text-xs text-[var(--t-muted)] hidden sm:block">
              {data.cuisine} {data.priceLevel ? `· ${data.priceLevel}` : ""}
            </span>
          )}
        </div>
      </header>

      {/* Hero - side by side */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-sm font-semibold text-[var(--t-accent)] uppercase tracking-wider mb-3">
            Welcome
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold leading-tight mb-4"
            style={{ fontFamily: "var(--t-font-display)" }}
          >
            {data.tagline || data.name || "A neighborhood favorite"}
          </h2>
          {data.story && (
            <p className="text-[var(--t-muted)] leading-relaxed line-clamp-5">
              {data.story}
            </p>
          )}
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl ring-1 ring-[var(--t-border)]">
          <SafeImg
            src={data.heroImageUrl}
            alt={data.name || "Restaurant"}
            className="w-full h-full object-cover"
            fallbackClassName="w-full h-full"
          />
        </div>
      </section>

      {/* Menu */}
      {data.menu.length > 0 && (
        <section className="bg-[var(--t-card)] py-16 px-6 border-y border-[var(--t-border)]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-[var(--t-accent)] uppercase tracking-wider mb-2">
                What we serve
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{ fontFamily: "var(--t-font-display)" }}
              >
                Our Menu
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {data.menu.map((section) => (
                <div key={section.id}>
                  <h3
                    className="text-2xl font-bold mb-5 pb-2 border-b-2 border-[var(--t-accent)]/30"
                    style={{ fontFamily: "var(--t-font-display)" }}
                  >
                    {section.name}
                  </h3>
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div key={item.id} className="group">
                        <div className="flex justify-between items-baseline gap-3">
                          <div className="flex items-baseline gap-2 flex-wrap min-w-0">
                            <h4 className="font-semibold">{item.name}</h4>
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--t-accent)]/10 text-[var(--t-accent)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {item.price && (
                            <span className="font-bold text-[var(--t-accent)] tabular-nums flex-shrink-0">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-[var(--t-muted)] mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hours + Contact */}
      <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10">
        {data.hours.length > 0 && (
          <div className="bg-[var(--t-card)] rounded-2xl p-6 ring-1 ring-[var(--t-border)] shadow-sm">
            <h3
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "var(--t-font-display)" }}
            >
              Hours
            </h3>
            <dl className="space-y-1.5">
              {data.hours.map((h) => (
                <div
                  key={h.day}
                  className="flex justify-between text-sm py-1"
                >
                  <dt className="font-medium">{h.day}</dt>
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
          <div className="bg-[var(--t-card)] rounded-2xl p-6 ring-1 ring-[var(--t-border)] shadow-sm">
            <h3
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "var(--t-font-display)" }}
            >
              Find Us
            </h3>
            <ul className="space-y-3 text-sm">
              {data.contact.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 mt-0.5 text-[var(--t-accent)] flex-shrink-0" />
                  <span>{data.contact.address}</span>
                </li>
              )}
              {data.contact.phone && (
                <li className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 mt-0.5 text-[var(--t-accent)] flex-shrink-0" />
                  <a
                    href={`tel:${data.contact.phone}`}
                    className="hover:text-[var(--t-accent)]"
                  >
                    {data.contact.phone}
                  </a>
                </li>
              )}
              {data.contact.email && (
                <li className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 mt-0.5 text-[var(--t-accent)] flex-shrink-0" />
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="hover:text-[var(--t-accent)] break-all"
                  >
                    {data.contact.email}
                  </a>
                </li>
              )}
              {data.contact.instagram && (
                <li className="flex items-start gap-2.5">
                  <Instagram className="h-4 w-4 mt-0.5 text-[var(--t-accent)] flex-shrink-0" />
                  <span>{data.contact.instagram}</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[var(--t-card)] border-t border-[var(--t-border)] py-6 px-6 text-center">
        <p className="text-xs text-[var(--t-muted)]">
          © {new Date().getFullYear()} {data.name || "Restaurant"}
        </p>
      </footer>
    </div>
  );
}
