export type ToolboxItem = {
  id: string;
  label: string;
  accentColor: string;
};

export const toolboxItems: ToolboxItem[] = [
  {
    id: "clear-gateway-cache",
    label: "Clear Gateway Cache",
    accentColor: "#10B981",
  },
  {
    id: "reboot-server",
    label: "Reboot Server",
    accentColor: "#10B981",
  },
  {
    id: "reset-auth-token",
    label: "Reset Auth Token",
    accentColor: "#10B981",
  },
];

export const TRIGGER_NODE_ID = "trigger";
export const TRIGGER_BORDER_COLOR = "#EF4444";
