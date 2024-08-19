export enum Dimensions {
  CIRCLE_RADIUS = 7.5,
  X_OFFSET = CIRCLE_RADIUS,
  BAR_HEIGHT = 4,
  BAR_WIDTH = 180,
  VERTICAL_PADDING = 2,
  VIEWBOX_HEIGHT = CIRCLE_RADIUS * 2 + VERTICAL_PADDING * 2,
  VIEWBOX_WIDTH = BAR_WIDTH + CIRCLE_RADIUS * 2,
  VERTICAL_CENTER = VIEWBOX_HEIGHT / 2,
};

export enum LinearGradientIds {
  TEAL_YELLOW_GRADIENT_ID = "teal_yellow_gradient",
  TRANSPARENT_GRAY_GRADIENT_ID = "transparent_gray_gradient"
};

export enum Colors {
  LIGHT_GRAY = "#dedede",
  TEAL = "#02ddc3",
  YELLOW = "#ffed10"
}