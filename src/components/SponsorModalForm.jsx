"use client";

import { AD_POSITIONS } from "@/lib/constants";
import { readImageFile, toDateInput } from "@/lib/format";
import { ghostButtonClass, inputClass, primaryButtonClass } from "@/lib/ui";
import { useEffect, useState } from "react";

const emptySponsor = {
  title: "",
  date: "",
  adPosition: "",
  adImage: "",
  adDuration: "",
  isActive: true,
};

export default function SponsorModalForm({ mode, initialData, submitting, onClose, onSubmit }) {
  const [form, setForm] = useState(emptySponsor);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        title: initialData.title || "",
        date: toDateInput(initialData.date),
        adPosition: initialData.adPosition || "",
        adImage: initialData.adImage || "",
        adDuration: initialData.adDuration ?? "",
        isActive: initialData.isActive !== false,
      });
    } else {
      setForm(emptySponsor);
    }
    setError("");
  }, [mode, initialData]);

  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const onImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      setField("adImage", dataUrl);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.date || !form.adPosition || !form.adImage) {
      setError("Title, date, position, and image are required.");
      return;
    }
    onSubmit({
      title: form.title.trim(),
      date: form.date,
      adPosition: form.adPosition,
      adImage: form.adImage,
      adDuration: form.adDuration === "" ? undefined : Number(form.adDuration),
      isActive: Boolean(form.isActive),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-600">Title</span>
        <input
          required
          value={form.title}
          onChange={(event) => setField("title", event.target.value)}
          className={inputClass}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">Published date</span>
          <input
            required
            type="date"
            value={form.date}
            onChange={(event) => setField("date", event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">Duration (days)</span>
          <input
            type="number"
            min="0"
            value={form.adDuration}
            onChange={(event) => setField("adDuration", event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-600">Position</span>
        <select
          required
          value={form.adPosition}
          onChange={(event) => setField("adPosition", event.target.value)}
          className={inputClass}
        >
          <option value="">Select a position</option>
          {AD_POSITIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <div>
        <span className="mb-1 block text-xs font-medium text-neutral-600">Image</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onImage}
          className={inputClass}
        />
        {form.adImage && <img src={form.adImage} alt="" className="mt-2 h-20 max-w-full rounded object-contain" />}
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(event) => setField("isActive", event.target.checked)}
          className="accent-primary"
        />
        Active
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className={ghostButtonClass}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
