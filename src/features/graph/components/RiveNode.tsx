import { useRive, useStateMachineInput, Layout, Fit } from "@rive-app/react-canvas";
import { GraphNode } from "@/shared/types/graph";

interface Props {
  node: GraphNode;
  hovered?: boolean;
  selected?: boolean;
  size?: number;
  metric?: number;
}

export function RiveNode({ node, hovered = false, selected = false, size = 40, metric = 0 }: Props) {
  const { RiveComponent, rive } = useRive({
    src: "/rive/cluster.riv",
    autoplay: true,
    stateMachines: "nodeSM",
    layout: new Layout({ fit: Fit.Contain }),
  });

  const hoveredInput = useStateMachineInput(rive, "nodeSM", "hovered");
  const selectedInput = useStateMachineInput(rive, "nodeSM", "selected");
  const sizeInput = useStateMachineInput(rive, "nodeSM", "size");
  const metricInput = useStateMachineInput(rive, "nodeSM", "metric");

  if (hoveredInput) hoveredInput.value = hovered;
  if (selectedInput) selectedInput.value = selected;
  if (sizeInput) sizeInput.value = size;
  if (metricInput) metricInput.value = metric;

  return (
    <div
      className="rive-node"
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
        width: size,
        height: size,
      }}
    >
      <RiveComponent width={size} height={size} />
    </div>
  );
}
