export const hexToNormalizedRGB = (hex: string) => {
  const _hex = hex.replace('#', '');

  return [
    Number.parseInt(_hex.slice(0, 2), 16) / 255,
    Number.parseInt(_hex.slice(2, 4), 16) / 255,
    Number.parseInt(_hex.slice(4, 6), 16) / 255,
  ];
};
