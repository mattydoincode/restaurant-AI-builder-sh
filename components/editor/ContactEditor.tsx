"use client";

import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactEditor() {
  const data = useStore((s) => s.data);
  const patch = useStore((s) => s.patch);

  const updateContact = (change: Partial<typeof data.contact>) =>
    patch({ contact: { ...data.contact, ...change } });

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={data.contact.address}
          onChange={(e) => updateContact({ address: e.target.value })}
          placeholder="123 Main St, City, State"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={data.contact.phone}
            onChange={(e) => updateContact({ phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.contact.email}
            onChange={(e) => updateContact({ email: e.target.value })}
            placeholder="hello@example.com"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          value={data.contact.instagram}
          onChange={(e) => updateContact({ instagram: e.target.value })}
          placeholder="@yourrestaurant"
        />
      </div>
      <div>
        <Label htmlFor="mapsUrl">Google Maps URL (optional)</Label>
        <Input
          id="mapsUrl"
          value={data.contact.mapsUrl}
          onChange={(e) => updateContact({ mapsUrl: e.target.value })}
          placeholder="https://maps.google.com/?q=..."
        />
      </div>
    </div>
  );
}
