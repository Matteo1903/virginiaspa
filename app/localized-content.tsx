import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { translate, type Language } from "./i18n";

// Translate React content before it renders; never mutate hydrated DOM nodes.
export function translateTree(children: ReactNode, language: Language): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") {
      const value = child.replace(/\s+/g, " ").trim();
      if (!value) return child;
      return (child.match(/^\s+/)?.[0] || "") + translate(value, language) + (child.match(/\s+$/)?.[0] || "");
    }
    if (!isValidElement<Record<string, unknown>>(child)) return child;
    const props: Record<string, unknown> = {};
    for (const name of ["aria-label", "title", "placeholder", "alt", "label"]) {
      if (typeof child.props[name] === "string") props[name] = translate(child.props[name], language);
    }
    // Preserve customer-entered values, brands, component internals and handlers.
    if (child.props.children !== undefined) props.children = translateTree(child.props.children as ReactNode, language);
    return cloneElement(child, props);
  });
}
export function LocalizedContent({ children, language }: { children: ReactNode; language: Language }) {
  return translateTree(children, language);
}
