export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function toDateInput(value) {
  if (!value) return "";
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function toListText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value || "";
}

export function fromListText(value) {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function readImageFile(file) {
  if (!file) return Promise.resolve("");
  if (!ALLOWED_TYPES.includes(file.type)) {
    return Promise.reject(new Error("Use a JPG, PNG, WEBP, or GIF image."));
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return Promise.reject(new Error("Image must be 5MB or smaller."));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(file);
  });
}

export function readImageFiles(fileList) {
  return Promise.all(Array.from(fileList || []).map((file) => readImageFile(file)));
}
