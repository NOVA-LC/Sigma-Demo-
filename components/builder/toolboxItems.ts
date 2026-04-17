export type CategoryId =
  | "authentication"
  | "hardware"
  | "network"
  | "compute-services";

export type CategoryItem = {
  id: string;
  label: string;
  accentColor: string;
};

export type Category = {
  id: CategoryId;
  label: string;
  items: CategoryItem[];
};

const ACTION_GREEN = "#10B981";

export const categories: Category[] = [
  {
    id: "authentication",
    label: "Authentication",
    items: [
      { id: "reset-auth-token", label: "Reset Auth Token", accentColor: ACTION_GREEN },
      { id: "force-logout-session", label: "Force Logout Session", accentColor: ACTION_GREEN },
      { id: "rotate-jwt-keys", label: "Rotate JWT Keys", accentColor: ACTION_GREEN },
    ],
  },
  {
    id: "hardware",
    label: "Hardware",
    items: [
      { id: "reboot-server", label: "Reboot Server", accentColor: ACTION_GREEN },
      { id: "power-cycle-device", label: "Power Cycle Device", accentColor: ACTION_GREEN },
      { id: "swap-backup-node", label: "Swap to Backup Node", accentColor: ACTION_GREEN },
    ],
  },
  {
    id: "network",
    label: "Network",
    items: [
      { id: "clear-gateway-cache", label: "Clear Gateway Cache", accentColor: ACTION_GREEN },
      { id: "flush-dns-records", label: "Flush DNS Records", accentColor: ACTION_GREEN },
      { id: "restart-load-balancer", label: "Restart Load Balancer", accentColor: ACTION_GREEN },
    ],
  },
  {
    id: "compute-services",
    label: "Compute Services",
    items: [
      { id: "scale-up-pool", label: "Scale Up Pool", accentColor: ACTION_GREEN },
      { id: "restart-worker-queue", label: "Restart Worker Queue", accentColor: ACTION_GREEN },
      { id: "drain-node", label: "Drain Node", accentColor: ACTION_GREEN },
    ],
  },
];

// Flat lookup keyed by item id — convenient for the page-level logic that
// turns an itemId into a label / accent color / category.
export const itemsById: Record<
  string,
  CategoryItem & { categoryId: CategoryId }
> = Object.fromEntries(
  categories.flatMap((c) =>
    c.items.map(
      (i) =>
        [i.id, { ...i, categoryId: c.id }] as const,
    ),
  ),
);

export const TRIGGER_NODE_ID = "trigger";
export const TRIGGER_BORDER_COLOR = "#EF4444";

// Stable ids + positions for the nodes the tutorial can add to the canvas.
export const NODE_ID_BY_ITEM: Record<string, string> = {
  "clear-gateway-cache": "node-clear-cache",
  "reboot-server": "node-reboot-server",
};

export const POSITION_BY_ITEM: Record<string, { x: number; y: number }> = {
  "clear-gateway-cache": { x: 260, y: 180 },
  "reboot-server": { x: 260, y: 320 },
};

export type TutorialStep =
  | "add-clear-cache"
  | "add-reboot"
  | "deploy"
  | "running"
  | "done";

export type TutorialConfig = {
  activeCategoryId: CategoryId | null;
  activeItemId: string | null;
  tooltip: string | null;
  highlightDeploy: boolean;
};

export const tutorialByStep: Record<TutorialStep, TutorialConfig> = {
  "add-clear-cache": {
    activeCategoryId: "network",
    activeItemId: "clear-gateway-cache",
    tooltip: "Fastest low-risk attempt.",
    highlightDeploy: false,
  },
  "add-reboot": {
    activeCategoryId: "hardware",
    activeItemId: "reboot-server",
    tooltip: "Fallback if cache fails.",
    highlightDeploy: false,
  },
  deploy: {
    activeCategoryId: null,
    activeItemId: null,
    tooltip: null,
    highlightDeploy: true,
  },
  running: {
    activeCategoryId: null,
    activeItemId: null,
    tooltip: null,
    highlightDeploy: false,
  },
  done: {
    activeCategoryId: null,
    activeItemId: null,
    tooltip: null,
    highlightDeploy: false,
  },
};
