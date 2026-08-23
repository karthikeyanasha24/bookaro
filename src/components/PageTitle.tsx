import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const humanize = (segment: string) => {
  return segment
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
};

const PageTitle = ({ routes }: any) => {
  const location = useLocation();

  useEffect(() => {
    let bestMatch = null;
    for (const route of routes) {
      if (route.url === "*" || route.url === "/" || !route.path) continue;
      const pattern = route.url.replace(/:[^/]+/g, "[^/]+");
      if (new RegExp(`^${pattern}$`).test(location.pathname)) {
        if (!bestMatch || route.url.length >= bestMatch.url.length) {
          bestMatch = route;
        }
      }
    }

    if (!bestMatch) {
      bestMatch = routes.find((r: any) => r.url === "*");
    }

    const base =
      bestMatch && bestMatch.path
        ? bestMatch.path
            .split("/")
            .map(humanize)
            .filter(Boolean)
            .join(" - ")
        : "";
    const title = base ? `${base} - AnyHomes` : "AnyHomes";
    document.title = title;
  }, [location.pathname, routes]);

  return null;
};

export default PageTitle;
