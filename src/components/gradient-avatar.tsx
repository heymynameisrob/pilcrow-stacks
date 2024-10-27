import React, { useMemo } from "react";

export function Avatar({ name }: { name: string }) {
  const colorPairs = useMemo(
    () => [
      ["#FF6B6B", "#4ECDC4"], // Red & Teal
      ["#20B2AA", "#74B06F"], // Light Sea Green & Sage
      ["#6A5ACD", "#FF69B4"], // Slate Blue & Hot Pink
      ["#4B0082", "#00CED1"], // Indigo & Dark Turquoise
      ["#32CD32", "#FFD700"], // Lime Green & Gold
      ["#8A2BE2", "#00FF7F"], // Blue Violet & Spring Green
      ["#FF4500", "#1E90FF"], // Orange Red & Dodger Blue
      ["#9370DB", "#3CB371"], // Medium Purple & Sea Green
      ["#FF8C00", "#00BFFF"], // Dark Orange & Deep Sky Blue
      ["#BA55D3", "#228B22"], // Medium Orchid & Forest Green
      ["#FF1493", "#7B68EE"], // Deep Pink & Medium Slate Blue
      ["#2E8B57", "#DDA0DD"], // Sea Green & Plum
      ["#8B4513", "#40E0D0"], // Saddle Brown & Turquoise
      ["#9932CC", "#98FB98"], // Dark Orchid & Pale Green
      ["#CD853F", "#87CEEB"], // Peru & Sky Blue
      ["#DB7093", "#3CB371"], // Pale Violet Red & Medium Sea Green
      ["#FF7F50", "#6495ED"], // Coral & Cornflower Blue
      ["#BDB76B", "#8B008B"], // Dark Khaki & Dark Magenta
      ["#556B2F", "#FF69B4"], // Dark Olive Green & Hot Pink
      ["#8B0000", "#48D1CC"], // Dark Red & Medium Turquoise
      ["#9400D3", "#98FB98"], // Dark Violet & Pale Green
      ["#2F4F4F", "#FF8C00"], // Dark Slate Gray & Dark Orange
      ["#800080", "#00FA9A"], // Purple & Medium Spring Green
      ["#BC8F8F", "#4169E1"], // Rosy Brown & Royal Blue
      ["#4682B4", "#FFA07A"], // Steel Blue & Light Salmon
      ["#008080", "#FFB6C1"], // Teal & Light Pink
    ],
    [],
  );

  const getColorPairByInitial = (name: string) => {
    if (!name) return colorPairs[0];
    const initial = name.charAt(0).toUpperCase();
    const initialIndex = initial.charCodeAt(0) - 65;
    const colorIndex = Math.abs(initialIndex % colorPairs.length);
    return colorPairs[colorIndex];
  };

  const getRotationByInitial = (name: string) => {
    if (!name) return 0;
    const initial = name.charAt(0).toUpperCase();
    const initialValue = initial.charCodeAt(0) - 65; // A=0, B=1, etc.
    return (initialValue * 15) % 360; // Multiply by 15 to get bigger rotation jumps
  };

  const [primaryColor, secondaryColor] = getColorPairByInitial(name);
  const rotation = getRotationByInitial(name);

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      width="40"
      height="40"
      className="rounded-full"
    >
      <mask
        id="mask__marble"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="40"
        height="40"
      >
        <rect width="40" height="40" rx="80" fill="#FFFFFF"></rect>
      </mask>
      <g mask="url(#mask__marble)">
        <rect width="40" height="40" fill={primaryColor}></rect>
        <path
          filter="url(#prefix__filter0_f)"
          d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
          fill={secondaryColor}
          transform={`
            translate(2 -2)
            rotate(${rotation} 20 20)
            scale(1.2)
          `}
        ></path>
        <path
          filter="url(#prefix__filter0_f)"
          d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
          fill={secondaryColor}
          transform={`
            translate(-3 -3)
            rotate(${-rotation} 20 20)
            scale(1.3)
          `}
          style={{ mixBlendMode: "overlay" }}
        ></path>
      </g>
      <defs>
        <filter
          id="prefix__filter0_f"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            stdDeviation="7"
            result="effect1_foregroundBlur"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  );
}
