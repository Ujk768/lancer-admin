export const QUEST_CATEGORIES = [
  "Cardio",
  "Strength",
  "Core",
  "Mobility",
  "Recovery",
  "Conditioning",
  "Swimming",
  "Yoga",
  "Gym",
  "Classes",
  "Lifestyle",
];

// Challenge image bank. When an admin creates a challenge, a handful of images
// matching the activity type are presented for one-tap selection. They can also
// paste any image URL or pick from their own files. Every challenge carries an
// imageUrl that renders on the challenge list and detail views.
//
// These are hosted Unsplash images referenced by URL, so nothing is bundled.
// To remove the built-in suggestions entirely, empty the arrays below; the
// URL and file-upload paths keep working.

const u = (id:string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const CHALLENGE_IMAGE_BANK = {
  Gym: [
    u("1534438327276-14e5300c3a48"),
    u("1517836357463-d25dfeac3438"),
    u("1571019614242-c5c5dee9f50b"),
    u("1526506118085-60ce8714f8c5"),
  ],
  Running: [
    u("1552674605-db6ffd4facb5"),
    u("1476480862126-209bfaa8edc8"),
    u("1461896836934-ffe607ba8211"),
    u("1486218119243-13883505764c"),
  ],
  Cycling: [
    u("1517649763962-0c623066013b"),
    u("1541625602330-2277a4c46182"),
    u("1534787238916-9ba6764efd4f"),
    u("1509395176047-4a66953fd231"),
  ],
  Swimming: [
    u("1600965962361-9035dbfd1c50"),
    u("1530549387789-4c1017266635"),
    u("1519315901367-f34ff9154487"),
    u("1571731956672-f2b94d7dd0cb"),
  ],
  Yoga: [
    u("1544367567-0f2fcb009e0b"),
    u("1506126613408-eca07ce68773"),
    u("1552196563-55cd4e45efb3"),
    u("1575052814086-f385e2e2ad1b"),
  ],
};

// A neutral fallback used when a challenge has no image and none is chosen.
export const CHALLENGE_IMAGE_FALLBACK = u("1517838277536-f5f99be501cd");

export function imagesForType(type: keyof typeof CHALLENGE_IMAGE_BANK): string[] {
  return CHALLENGE_IMAGE_BANK[type] || CHALLENGE_IMAGE_BANK.Gym;
}

export function formatDate(dateString: string): string {
  // Pass directly; JavaScript natively handles ISO strings
  const d = new Date(dateString);
  
  if (Number.isNaN(d.getTime())) return dateString;
  
  return d.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
