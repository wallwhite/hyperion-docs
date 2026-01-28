import { createElement, type ReactNode } from "react";
import { icons } from "lucide-react";
import { type LoaderPlugin } from "fumadocs-core/source";

export const safeLucideIconsPlugin = (
  options: { defaultIcon?: keyof typeof icons } = {},
): LoaderPlugin => {
  const { defaultIcon = "FileQuestionMark" } = options;

  const resolveIcon = (icon: unknown): ReactNode => {
    if (!icon || typeof icon !== "string") return icon as ReactNode;

    const Icon = icons[icon as keyof typeof icons];
    if (Icon) {
      return createElement(Icon);
    }

    console.warn(
      `[safe-lucide-icons] ⚠️ Icon "${icon}" not found. Falling back to "${defaultIcon}".`,
    );

    return createElement(icons[defaultIcon]);
  };

  return {
    name: "safe-lucide-icons",
    transformStorage({ storage }) {
      for (const file of storage.files.values()) {
        if (file.format === "page") {
          file.data.icon = resolveIcon(file.data.icon) as any;
        }
      }
    },
    transformPageTree: {
      file: (node) => {
        node.icon = resolveIcon(node.icon);
        return node;
      },
      folder: (node) => {
        node.icon = resolveIcon(node.icon);
        return node;
      },
      separator: (node) => {
        node.icon = resolveIcon(node.icon);
        return node;
      },
    },
  };
};
