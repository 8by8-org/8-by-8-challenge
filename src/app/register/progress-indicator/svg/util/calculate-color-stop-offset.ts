import { Dimensions } from "../constants";
import { ProgressPercent } from "../../progress-percent";

export function calculateColorStopOffset(progressPercent : ProgressPercent) {
  switch(progressPercent) {
    case 25 :
      return (Dimensions.X_OFFSET + Dimensions.CIRCLE_RADIUS) / Dimensions.VIEWBOX_WIDTH;
    case 50 :
      return (Dimensions.X_OFFSET + Dimensions.BAR_WIDTH / 3 + Dimensions.CIRCLE_RADIUS) / Dimensions.VIEWBOX_WIDTH;
    case 75 :
      return (Dimensions.X_OFFSET + Dimensions.BAR_WIDTH * 2 / 3 + Dimensions.CIRCLE_RADIUS) / Dimensions.VIEWBOX_WIDTH;
    case 100:
      return 1;
  }
}