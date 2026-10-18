// src/components/facultyTheme.ts
//
// The nine-faculty theme for the admin console, mirrored from the mobile app so
// the admin renders each faculty with the SAME accent colour + name students
// see in-app. The admin's original Glyphs registry only had six generic
// faculties (cs/eng/sci/biz/kin/nur); real users carry facultyKey
// faculty1..faculty9, so we map here.
//
// Each faculty also gets a `crest` id (one of the six FacultyCrest glyphs that
// ship in Glyphs.tsx — reused as a close visual match) and a `plume` colour for
// the SVG KnightAvatar. Avatars are pure SVG (no PNGs), so the admin renders
// identical knight avatars to the app without needing the frontend image files.

export interface FacultyTheme {
  name: string;
  accent: string;
  accentSoft: string;
  accentLine: string;
  crest: string; // a FacultyCrest glyph id from Glyphs.tsx
}

export const FACULTY_THEME: Record<string, FacultyTheme> = {
  faculty1: { name: "Arts, Humanities & Social Sciences", accent: "#C8102E", accentSoft: "rgba(200,16,46,0.12)", accentLine: "rgba(200,16,46,0.36)", crest: "nur" },
  faculty2: { name: "Education", accent: "#2A6EBB", accentSoft: "rgba(42,110,187,0.12)", accentLine: "rgba(42,110,187,0.36)", crest: "cs" },
  faculty3: { name: "Engineering", accent: "#0E7A5F", accentSoft: "rgba(14,122,95,0.12)", accentLine: "rgba(14,122,95,0.36)", crest: "eng" },
  faculty4: { name: "Graduate Studies", accent: "#C79A05", accentSoft: "rgba(199,154,5,0.13)", accentLine: "rgba(199,154,5,0.38)", crest: "biz" },
  faculty5: { name: "Human Kinetics", accent: "#6B3FA0", accentSoft: "rgba(107,63,160,0.12)", accentLine: "rgba(107,63,160,0.36)", crest: "kin" },
  faculty6: { name: "Law", accent: "#C05A1B", accentSoft: "rgba(192,90,27,0.12)", accentLine: "rgba(192,90,27,0.36)", crest: "biz" },
  faculty7: { name: "Nursing", accent: "#5E7CA8", accentSoft: "rgba(94,124,168,0.14)", accentLine: "rgba(94,124,168,0.38)", crest: "nur" },
  faculty8: { name: "Odette School of Business", accent: "#7A1F2B", accentSoft: "rgba(122,31,43,0.14)", accentLine: "rgba(122,31,43,0.38)", crest: "biz" },
  faculty9: { name: "Science", accent: "#2E8B84", accentSoft: "rgba(46,139,132,0.12)", accentLine: "rgba(46,139,132,0.36)", crest: "sci" },
};

export function themeForFaculty(facultyKey?: string | null): FacultyTheme {
  return (
    (facultyKey && FACULTY_THEME[facultyKey]) || {
      name: "",
      accent: "#4A93D8",
      accentSoft: "rgba(74,147,216,0.12)",
      accentLine: "rgba(74,147,216,0.36)",
      crest: "cs",
    }
  );
}

// Faculty display value -> stable key, mirroring the backend map.
export const FACULTY_KEY_BY_VALUE: Record<string, string> = {
  "Faculty of Arts, Humanities and Social Sciences": "faculty1",
  "Faculty of Education": "faculty2",
  "Faculty of Engineering": "faculty3",
  "Faculty of Graduate Studies": "faculty4",
  "Faculty of Human Kinetics": "faculty5",
  "Faculty of Law": "faculty6",
  "Faculty of Nursing": "faculty7",
  "Odette School of Business": "faculty8",
  "Faculty of Science": "faculty9",
};

export function facultyKeyFrom(entry: { facultyKey?: string | null; faculty?: string | null }): string {
  if (entry.facultyKey) return entry.facultyKey;
  if (entry.faculty && FACULTY_KEY_BY_VALUE[entry.faculty]) return FACULTY_KEY_BY_VALUE[entry.faculty];
  return "faculty9";
}

// Lancer level (2000 XP/level) -> knight avatar variant (0..5). The mobile app
// evolves the avatar art by tier; here we shift the SVG helmet variant so a
// higher-level student visibly differs from a Squire.
export function avatarVariantFromLevel(level = 1): number {
  if (level >= 20) return 5;
  if (level >= 14) return 4;
  if (level >= 8) return 3;
  if (level >= 3) return 2;
  return 0;
}

// Lancer level -> avatar PNG tier (1..5), matching the frontend's
// assets/avatars/<facultyKey>/<tier>.png ladder. This picks which REAL avatar
// image the admin renders, so a Hero shows the Hero art, not the Squire.
export function avatarTierFromLevel(level = 1): number {
  if (level >= 20) return 5;
  if (level >= 14) return 4;
  if (level >= 8) return 3;
  if (level >= 3) return 2;
  return 1;
}