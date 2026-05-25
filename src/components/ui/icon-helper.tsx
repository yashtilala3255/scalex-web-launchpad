import * as Icons from "lucide-react";

/**
 * Dynamically resolves a string name to a Lucide React component.
 * Falls back to HelpCircle if the icon name is not found.
 */
export const getIconComponent = (name: string) => {
  if (!name) return Icons.HelpCircle;
  const Icon = (Icons as any)[name];
  return Icon || Icons.HelpCircle;
};
