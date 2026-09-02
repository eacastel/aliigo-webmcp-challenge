"use client";
import { useActionLayer } from "@/app/providers";
import type { BusinessId } from "@/businesses/types";

const options: Array<{ id: BusinessId; label: string; eyebrow: string }> = [
  { id: "luma", label: "Wellness Studio", eyebrow: "Luma" },
  { id: "northstar", label: "Print & Sign", eyebrow: "Northstar" },
];

export function BusinessSwitcher() {
  const { selected, selectBusiness } = useActionLayer();
  return <div className="business-switcher" aria-label="Choose a fictional business">
    {options.map((option) => <button type="button" key={option.id} className={selected === option.id ? "business-option active" : "business-option"} aria-pressed={selected === option.id} onClick={() => selectBusiness(option.id)}><span>{option.eyebrow}</span>{option.label}</button>)}
  </div>;
}
