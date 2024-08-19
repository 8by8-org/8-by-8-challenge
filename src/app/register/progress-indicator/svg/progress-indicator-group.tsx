import { Dimensions } from "./constants";

type ElementId = `#${string}`;

interface ProgressIndicatorGroupProps {
  fillId : ElementId;
}

export function ProgressIndicatorGroup({ fillId } : ProgressIndicatorGroupProps) {
  return (
    <g fill={`url(${fillId})`}>
      <rect 
        x={Dimensions.X_OFFSET} 
        y={Dimensions.VERTICAL_CENTER - Dimensions.BAR_HEIGHT / 2} 
        height={Dimensions.BAR_HEIGHT} 
        width={Dimensions.BAR_WIDTH}
      />
      <circle 
        cx={Dimensions.X_OFFSET} 
        cy={Dimensions.VERTICAL_CENTER}
         r={Dimensions.CIRCLE_RADIUS}   
      />
      <circle 
        cx={Dimensions.BAR_WIDTH / 3 + Dimensions.X_OFFSET} 
        cy={Dimensions.VERTICAL_CENTER}
         r={Dimensions.CIRCLE_RADIUS}   
      />
      <circle 
        cx={Dimensions.BAR_WIDTH * 2 / 3 + Dimensions.X_OFFSET} 
        cy={Dimensions.VERTICAL_CENTER}
         r={Dimensions.CIRCLE_RADIUS}   
      />
      <circle 
        cx={Dimensions.BAR_WIDTH + Dimensions.X_OFFSET} 
        cy={Dimensions.VERTICAL_CENTER}
         r={Dimensions.CIRCLE_RADIUS}   
      />
    </g>
  );
}