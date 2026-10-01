export const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.kalkisenatimes.com/api/v1/en";

export const PAGE_SIZE = 10;

export const CATEGORIES = [
  { value: "news", label: "News (समाचार)" },
  { value: "kalkism", label: "Kalkism (कल्किबाद)" },
  { value: "krantikar", label: "Krantikar (क्रान्ति)" },
  { value: "international-politics", label: "International Politics (विश्व दर्शन)" },
  { value: "samvad", label: "Samvad (विचार विमर्श)" },
  { value: "health", label: "Health (स्वास्थ्य)" },
  { value: "education", label: "Education (शिक्षा)" },
  { value: "law", label: "Law (कानुनी सेवा)" },
  { value: "development", label: "Development (समृद्धि)" },
  { value: "economy", label: "Economy (अर्थतन्त्र)" },
  { value: "prabhutva", label: "Cover Story (प्रभुत्व)" },
  { value: "book-analysis", label: "Book Analysis (किताब समीक्षा)" },
];

export const AD_POSITIONS = [
  { value: "homeBanner", label: "Home page banner" },
  { value: "homeLeft", label: "Home bottom left" },
  { value: "ad1", label: "Right side" },
  { value: "ad2", label: "Post details (right side)" },
  { value: "widead", label: "Wide bottom ad" },
];

export function labelFor(options, value) {
  return options.find((item) => item.value === value)?.label || value || "—";
}
