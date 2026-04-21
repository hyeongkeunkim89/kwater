declare module "react-simple-maps" {
  import type { ComponentType, MouseEventHandler, ReactNode, SVGProps } from "react";

  interface ProjectionConfig {
    center?: [number, number];
    scale?: number;
    rotate?: [number, number, number];
    parallels?: [number, number];
  }

  interface ComposableMapProps extends SVGProps<SVGSVGElement> {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    viewBox?: string;
  }

  interface GeographiesChildProps {
    geographies: Record<string, unknown>[];
  }

  interface GeographiesProps {
    geography: string | object;
    children: (props: GeographiesChildProps) => ReactNode;
  }

  interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: Record<string, unknown>;
  }

  interface MarkerProps {
    coordinates: [number, number];
    onClick?: MouseEventHandler<SVGGElement>;
    children?: ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const ZoomableGroup: ComponentType<Record<string, unknown>>;
}
