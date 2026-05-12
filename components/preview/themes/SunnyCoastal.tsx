"use client";

import type { RestaurantData } from "@/lib/schema";
import { SafeImg } from "../SafeImg";
import { formatTime, formatPrice } from "@/lib/utils";
import { Instagram, MapPin, Phone, Mail, Waves } from "lucide-react";

export function SunnyCoastal({ data }: { data: RestaurantData }) {
  return (
    <div className="theme-sunnyCoastal bg-[var(--t-bg)] text-[var(--t-fg)] min-h-full">
      <section className="relative overflow-hidden">
        <div className="relative h-[50vh] min-h-[360px] w-full">
          <SafeImg
            src={data.heroImageUrl}
            alt={data.name || "Restaurant"}
            className="absolute inset-0 w-full h-full object-cover"
            fallbackClassName="absolute inset-0 w-full h-full bg-sky-200"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/30 via-sky-900/10 to-[var(--t-bg)]" />
        </div>
        <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10">
          <div className="bg-[var(--t-card)] rounded-3xl shadow-xl ring-1 ring-[var(--t-border)] p-8 md:p-12 text-center">
            <Waves className="h-8 w-8 text-[var(--t-accent)] mx-auto mb-4" />
            <p className="text-sm font-semibold text-[var(--t-accent)] uppercase tracking-widest mb-3">
              {data.cuisine || "Restaurant"} {data.priceLevel ? `· ${data.priceLevel}` : ""}
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
              style={{ fontFamily: "var(--t-font-display)" }}
            >
              {data.name || "Your Restaurant"}
            </h1>
            {data.tagline && (
              <p className="text-lg text-[var(--t-muted)] max-w-2xl mx-auto">
                {data.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      {data.story && (
        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2
            className="text-3xl font-bold mb-5"
            style={{ fontFamily: "var(--t-font-display)" }}
          >
            About Us
          </h2>
          <p className="text-[var(--t-muted)] leading-relaxed whitespace-pre-line">
            {data.story}
          </p>
        </section>
      )}

      {data.menu.length > 0 && (
        <section className="bg-[var(--t-card)] py-16 px-6 border-y border-[var(--t-border)]">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-center mb-10"
              style={{ fontFamily: "var(--t-font-display)" }}
            >
              Menu
            </h2>
            <div className="space-y-10">
              {data.menu.map((section) => (
                <div key={section.id}>
                  <h3
                    className="text-2xl font-bold mb-4 text-[var(--t-accent)]"
                    style={{ fontFamily: "var(--t-font-display)" }}
                  >
                    {section.name}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[var(--t-bg)] p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-baseline gap-3">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <h4 className="font-semibold">{item.name}</h4>
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--t-accent)]/15 text-[var(--t-accent)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {item.price && (
                            <span className="font-bold text-[var(--t-accent)] tabular-nums">
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

      <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10">
        {data.hours.length > 0 && (
          <div>
            <h3
              className="text-2xl font-bold mb-5"
              style={{ fontFamily: "var(--t-font-display)" }}
            >
              Hours
            </h3>
            <dl className="space-y-2">
              {data.hours.map((h) => (
                <div
                  key={h.day}
                  className="flex justify-between text-sm py-1.5 border-b border-[var(--t-border)] last:border-0"
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
          <div>
            <h3
              className="text-2xl font-bold mb-5"
              style={{ fontFamily: "var(--t-font-display)" }}
            >
              Get in Touch
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
                  <span>{data.contact.phone}</span>
                </li>
              )}
              {data.contact.email && (
                <li className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 mt-0.5 text-[var(--t-accent)] flex-shrink-0" />
                  <span className="break-all">{data.contact.email}</span>
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

      <footer className="border-t border-[var(--t-border)] py-6 px-6 text-center">
        <p className="text-xs text-[var(--t-muted)]">
          © {new Date().getFullYear()} {data.name || "Restaurant"}
        </p>
      </footer>
    </div>
  );
}
