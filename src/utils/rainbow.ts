// Rainbow color generation and path rendering utilities

export const RAINBOW_PALETTE = [
  '#FF2A6D', // Vivid Pink/Red
  '#FF5E00', // Bright Orange
  '#FFAA00', // Yellow/Gold
  '#00E676', // Bright Green
  '#00E5FF', // Cyan / Aqua
  '#3D5AFE', // Electric Blue
  '#D500F9', // Violet / Magenta
];

export function getRainbowColor(index: number): string {
  return RAINBOW_PALETTE[index % RAINBOW_PALETTE.length];
}

/**
 * Draws a rainbow stroke with smooth multi-color interpolation along points
 */
export function drawRainbowStroke(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  lineWidth: number,
  opacity: number = 1
) {
  if (points.length === 0) return;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = lineWidth;

  if (points.length === 1) {
    ctx.beginPath();
    ctx.fillStyle = RAINBOW_PALETTE[0];
    ctx.arc(points[0].x, points[0].y, lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  // Draw segment by segment with shifting rainbow colors
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    const colorIndex = i % RAINBOW_PALETTE.length;
    const nextColorIndex = (i + 1) % RAINBOW_PALETTE.length;
    
    // Create linear gradient along the segment direction
    const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    grad.addColorStop(0, RAINBOW_PALETTE[colorIndex]);
    grad.addColorStop(1, RAINBOW_PALETTE[nextColorIndex]);

    ctx.beginPath();
    ctx.strokeStyle = grad;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  ctx.restore();
}
