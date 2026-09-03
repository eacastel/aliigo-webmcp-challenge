"use client";
import { useActionLayer } from "@/app/providers";
import type { BusinessId } from "@/businesses/types";

const options: Array<{ id: BusinessId; label: string; eyebrow: string }> = [
  { id: "luma", label: "Luma Wellness Studio", eyebrow: "01 · Wellness" },
  { id: "northstar", label: "Northstar Print & Sign", eyebrow: "02 · Print & signage" },
];

export function BusinessSwitcher() {
  const { selected, selectBusiness } = useActionLayer();
  return <div className="business-switcher" aria-label="Choose a fictional business">
    {options.map((option) => <button type="button" key={option.id} className={selected === option.id ? "business-option active" : "business-option"} aria-pressed={selected === option.id} onClick={() => selectBusiness(option.id)}><span>{option.eyebrow}</span>{option.label}</button>)}
  </div>;
}
