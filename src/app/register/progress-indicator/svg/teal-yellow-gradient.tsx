import { Colors, LinearGradientIds } from "./constants" 

export function TealYellowGradient() {
  return (
    <linearGradient id={LinearGradientIds.TEAL_YELLOW_GRADIENT_ID} gradientUnits="userSpaceOnUse">
      <stop 
        offset={0}
        stopColor={Colors.TEAL}
      />
      <stop
        offset={100}
        stopColor={Colors.YELLOW}
      />
    </linearGradient>
  );
}