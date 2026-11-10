/**
 * Icon system — maps semantic icon keys to SVG components (lucide-react).
 *
 * Rationale (ui-ux-pro-max §4 `no-emoji-icons`): emoji render differently on
 * every OS, cannot inherit color, break under forced-colors mode, and read
 * inconsistently to screen readers. All structural icons on this site are SVG.
 *
 * The CMS stores emoji glyphs in `icon` fields (legacy seed data). `ICON_MAP`
 * translates those glyphs — plus the semantic keys we use in code — into
 * lucide components, so CMS-driven icons also become real vector icons.
 */
import {
  BookOpen,
  Hammer,
  Handshake,
  Leaf,
  Sprout,
  Droplets,
  TreePine,
  Trash2,
  Waves,
  Wind,
  Sun,
  Zap,
  FileText,
  Package,
  Newspaper,
  Download,
  Upload,
  Link2,
  Camera,
  PenLine,
  Mic,
  Clapperboard,
  Play,
  Pause,
  Plus,
  Check,
  X,
  AlertCircle,
  Info,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Globe,
  Menu,
  Search,
  Filter,
  Users,
  Megaphone,
  Building2,
  Calendar,
  Send,
  Paperclip,
  Shield,
  Heart,
  Target,
  Compass,
  Layers,
  Sparkles,
  Quote,
  CircleAlert,
  Loader2,
  type LucideIcon,
} from "lucide-react";

/** Every icon the app can render. */
export const ICONS = {
  book: BookOpen,
  tools: Hammer,
  hands: Handshake,
  leaf: Leaf,
  sprout: Sprout,
  water: Droplets,
  tree: TreePine,
  waste: Trash2,
  coast: Waves,
  air: Wind,
  energy: Sun,
  zap: Zap,
  file: FileText,
  package: Package,
  newspaper: Newspaper,
  download: Download,
  upload: Upload,
  link: Link2,
  camera: Camera,
  pen: PenLine,
  mic: Mic,
  film: Clapperboard,
  play: Play,
  pause: Pause,
  plus: Plus,
  check: Check,
  close: X,
  warning: AlertCircle,
  info: Info,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  arrowUpRight: ArrowUpRight,
  mail: Mail,
  phone: Phone,
  pin: MapPin,
  globe: Globe,
  menu: Menu,
  search: Search,
  filter: Filter,
  users: Users,
  megaphone: Megaphone,
  building: Building2,
  calendar: Calendar,
  send: Send,
  paperclip: Paperclip,
  shield: Shield,
  heart: Heart,
  target: Target,
  compass: Compass,
  layers: Layers,
  sparkles: Sparkles,
  quote: Quote,
  error: CircleAlert,
  loader: Loader2,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/**
 * Legacy emoji → semantic icon key.
 * The Sanity `icon` fields still carry the emoji from the original seed;
 * this keeps CMS content editable without letting emoji reach the DOM.
 */
const EMOJI_MAP: Record<string, IconName> = {
  "📚": "book",
  "🛠": "tools",
  "🛠️": "tools",
  "🤝": "hands",
  "🌿": "leaf",
  "🌱": "sprout",
  "🌳": "tree",
  "🌊": "coast",
  "♻️": "waste",
  "🏞️": "compass",
  "🏞": "compass",
  "🌬️": "air",
  "☀️": "energy",
  "🔋": "energy",
  "📄": "file",
  "🧰": "package",
  "📰": "newspaper",
  "📥": "download",
  "⬇️": "download",
  "⬇": "download",
  "⬆️": "upload",
  "📸": "camera",
  "📐": "link",
  "✍️": "pen",
  "✍": "pen",
  "🎙️": "mic",
  "🎬": "film",
  "🎥": "film",
  "🎧": "mic",
  "🌾": "sprout",
  "📣": "megaphone",
  "🏛️": "building",
  "👥": "users",
  "❤️": "heart",
  "🛡️": "shield",
  "🎯": "target",
  "✨": "sparkles",
  "❝": "quote",
  "💬": "quote",
  "📋": "file",
  "📌": "target",
  "🧭": "compass",
  "🏢": "building",
  "💨": "air",
  "⚡": "zap",
  "🐟": "water",
  "🏕️": "compass",
};

/** Resolve any icon token (semantic key or legacy emoji) to an icon key. */
export function resolveIconKey(token: string | undefined | null): IconName {
  if (!token) return "leaf";
  if (token in ICONS) return token as IconName;
  if (EMOJI_MAP[token]) return EMOJI_MAP[token];
  // Editors sometimes append a note to the glyph (e.g. "🏞️NEMA"). Fall back
  // to the longest matching emoji prefix.
  const prefix = Object.keys(EMOJI_MAP)
    .filter((k) => token.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  if (prefix) return EMOJI_MAP[prefix];
  return "leaf";
}

/**
 * Terrain class for a thumbnail, derived from the icon.
 *
 * The CMS `thumbClass` and `icon` fields are edited independently, so an
 * editor can end up with a blue tile and a tree glyph. Deriving the terrain
 * from the icon keeps the picture and the subject in agreement; the CMS
 * class is still used when the icon is unknown.
 */
export function terrainFor(token: string | undefined | null): string {
  switch (resolveIconKey(token)) {
    case "water":
    case "coast":
      return "t-water";
    case "air":
      return "t-air";
    case "waste":
      return "t-waste";
    case "energy":
    case "zap":
      return "t-energy";
    case "tree":
    case "sprout":
    case "leaf":
      return "t-green";
    case "compass":
      return "t-sage";
    default:
      return "t-sage";
  }
}

/** Resolve any icon token (semantic key or legacy emoji) to a lucide icon. */
export function resolveIcon(token: string | undefined | null): LucideIcon {
  return ICONS[resolveIconKey(token)];
}

/**
 * Icon that is decorative when it sits next to a visible label, and labelled
 * when it is the only content. Pass `title` to give it an accessible name.
 *
 * The component reference is resolved from a module-level registry and
 * rendered directly — no component is ever created during render.
 */
export function Icon({
  name,
  size = 20,
  title,
  className,
  strokeWidth = 1.75,
}: {
  name: string | undefined | null;
  size?: number;
  title?: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = ICONS[resolveIconKey(name)];
  return (
    <Cmp
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
    />
  );
}
