import { AnimatedColorStop } from "./animated-color-stop";
import { Colors, LinearGradientIds } from "./constants";


export function TransparentGrayGradient() {
  return (
    <linearGradient id={LinearGradientIds.TRANSPARENT_GRAY_GRADIENT_ID} gradientUnits="userSpaceOnUse">
      <AnimatedColorStop color="transparent" />
      <AnimatedColorStop color={Colors.LIGHT_GRAY} />
    </linearGradient>
  )
}