"use client";

import "jodit/es2015/jodit.min.css";
import { CATEGORIES } from "@/lib/constants";
import { fromListText, readImageFile, readImageFiles, toDateInput, toListText } from "@/lib/format";
import { inputClass, primaryButtonClass, ghostButtonClass } from "@/lib/ui";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const emptyNews = {
  category: "",
  headline: "",
  subHeadline: "",
  date: "",
  content: "",
  authorName: "",
  authorImage: "",
  thumbnail: "",
  links: "",
  keywords: "",
  newsImages: [],
};

export default function NewsModalForm({ mode, initialData, submitting, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyNews);
  const [error, setError] = useState("");
  const editorRef = useRef(null);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write the article…",
      height: 280,
      uploader: { insertImageAsBase64URI: true },
    }),
    []
  );

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        category: initialData.category || "",
        headline: initialData.headline || "",
        subHeadline: initialData.subHeadline || "",
        date: toDateInput(initialData.date),
        content: initialData.content || "",
        authorName: initialData.authorName || "",
        authorImage: initialData.authorImage || "",
        thumbnail: initialData.thumbnail || "",
        links: toListText(initialData.links),
        keywords: toListText(initialData.keywords),
        newsImages: Array.isArray(initialData.newsImages) ? initialData.newsImages : [],
      });
    } else {
      setForm(emptyNews);
    }
    setError("");
  }, [mode, initialData]);

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const onImage = async (event, field) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      setField(field, dataUrl);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const onGallery = async (event) => {
    const files = event.target.files;
    event.target.value = "";
    if (!files?.length) return;
    try {
      const images = await readImageFiles(files);
      setField("newsImages", images);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.category || !form.headline.trim() || !form.date) {
      setError("Category, headline, and date are required.");
      return;
    }
    onSubmit({
      category: form.category,
      headline: form.headline.trim(),
      subHeadline: form.subHeadline.trim(),
      date: form.date,
      content: editorRef.current?.value ?? form.content,
      authorName: form.authorName.trim(),
      authorImage: form.authorImage,
      thumbnail: form.thumbnail,
      links: fromListText(form.links),
      keywords: fromListText(form.keywords),
      newsImages: form.newsImages,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-600">Category</span>
        <select
          required
          value={form.category}
          onChange={(event) => setField("category", event.target.value)}
          className={inputClass}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-600">Headline</span>
        <input
          required
          value={form.headline}
          onChange={(event) => setField("headline", event.target.value)}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-600">Sub-headline</span>
        <input
          value={form.subHeadline}
          onChange={(event) => setField("subHeadline", event.target.value)}
          className={inputClass}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">Publishing date</span>
          <input
            required
            type="date"
            value={form.date}
            onChange={(event) => setField("date", event.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">Author name</span>
          <input
            value={form.authorName}
            onChange={(event) => setField("authorName", event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div>
        <span className="mb-1 block text-xs font-medium text-neutral-600">Content</span>
        <JoditEditor
          editorRef={(instance) => {
            editorRef.current = instance;
          }}
          value={form.content}
          config={editorConfig}
          onBlur={(value) => setField("content", value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ImageField
          label="Author image"
          src={form.authorImage}
          onChange={(event) => onImage(event, "authorImage")}
        />
        <ImageField
          label="Thumbnail"
          src={form.thumbnail}
          onChange={(event) => onImage(event, "thumbnail")}
        />
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-600">Extra links, separated by commas</span>
        <input
          value={form.links}
          onChange={(event) => setField("links", event.target.value)}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-neutral-600">Keywords, separated by commas</span>
        <input
          value={form.keywords}
          onChange={(event) => setField("keywords", event.target.value)}
          className={inputClass}
        />
      </label>

      <div>
        <span className="mb-1 block text-xs font-medium text-neutral-600">News images</span>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={onGallery} className={inputClass} />
        {form.newsImages.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {form.newsImages.map((src, index) => (
              <img key={`${src}-${index}`} src={src} alt="" className="h-14 w-20 rounded object-cover" />
            ))}
          </div>
        )}
      </div>

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

function ImageField({ label, src, onChange }) {
  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-neutral-600">{label}</span>
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onChange} className={inputClass} />
      {src && <img src={src} alt="" className="mt-2 h-16 w-24 rounded object-cover" />}
    </div>
  );
}
