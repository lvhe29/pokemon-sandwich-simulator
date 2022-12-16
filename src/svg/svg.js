export const SVG = {};

SVG.DownArrow = (color = '#000', height = 40) => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 26.5 26.5" height={height}>
    <path
      d="m3.2 15.1 10 10 10-10h-6.6v-13H9.9v13z"
      fill={color}
      stroke="none"
      stroke-width=".3"
      stroke-linecap="butt"
      stroke-linejoin="miter"
      stroke-opacity="1"
      fill-opacity="1"
    />
  </svg>
);
