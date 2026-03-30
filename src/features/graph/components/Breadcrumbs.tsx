import { useGraphView } from "../hooks/useGraphView";

interface BreadcrumbItem {
  label: string;
  clusterId?: string;
}

interface Props {
  items?: BreadcrumbItem[];
}

/**
 * Show the cluster expansion path, for example: All → Food → Fruit → Citrus.
 * Clicking an item toggles navigation to that cluster in the graph view.
 */
export function Breadcrumbs({ items = [] }: Props) {
  const { toggleCluster } = useGraphView();

  const crumbs: BreadcrumbItem[] = [{ label: "All" }, ...items];

  return (
    <nav className="breadcrumbs" aria-label="Graph expansion path">
      {crumbs.map((crumb, i) => (
        <span key={i} className="breadcrumb-item">
          {i > 0 && <span className="breadcrumb-sep" aria-hidden>→</span>}
          {crumb.clusterId ? (
            <button
              className="breadcrumb-link"
              onClick={() => crumb.clusterId && toggleCluster(crumb.clusterId)}
            >
              {crumb.label}
            </button>
          ) : (
            <span className={i === crumbs.length - 1 ? "breadcrumb-current" : "breadcrumb-link"}>
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
