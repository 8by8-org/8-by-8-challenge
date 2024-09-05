import { Dimensions, LinearGradientIds } from './constants';
import { LinearGradients } from './linear-gradients';
import { ProgressIndicatorGroup } from './progress-indicator-group';

export function ProgressIndicatorSVG() {
  return (
    <svg
      viewBox={`0 0 ${Dimensions.VIEWBOX_WIDTH} ${Dimensions.VIEWBOX_HEIGHT}`}
      style={{ width: '100%' }}
    >
      <LinearGradients />
      <ProgressIndicatorGroup
        fillId={`#${LinearGradientIds.TEAL_YELLOW_GRADIENT_ID}`}
      />
      <ProgressIndicatorGroup
        fillId={`#${LinearGradientIds.TRANSPARENT_GRAY_GRADIENT_ID}`}
      />
    </svg>
  );
}
