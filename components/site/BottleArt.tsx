type BottleArtProps = {
  color: string;
  className?: string;
};

/**
 * Har bir atir uchun generativ shisha illyustratsiyasi — haqiqiy mahsulot
 * fotosurati o'rniga ishlatiladi. Rang `accentColor`dan keladi, shuning
 * uchun har bir mahsulot o'zining vizual izini oladi.
 */
export function BottleArt({ color, className }: BottleArtProps) {
  return (
    <svg
      viewBox="0 0 120 160"
      className={className}
      role="img"
      aria-label="Atir shishasi illyustratsiyasi"
    >
      <defs>
        <linearGradient id={`glass-${color.replace("#", "")}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* Qopqoq */}
      <rect x="46" y="8" width="28" height="20" rx="3" fill="var(--ink)" />
      <rect x="52" y="2" width="16" height="10" rx="2" fill="var(--ink)" />
      {/* Bo'yin */}
      <rect x="54" y="26" width="12" height="14" fill={color} opacity="0.5" />
      {/* Tana */}
      <rect
        x="30"
        y="40"
        width="60"
        height="104"
        rx="10"
        fill={`url(#glass-${color.replace("#", "")})`}
        stroke={color}
        strokeWidth="1.5"
      />
      {/* Etiketka */}
      <rect x="40" y="78" width="40" height="28" rx="2" fill="var(--bg-elevated)" opacity="0.85" />
      <line x1="46" y1="88" x2="74" y2="88" stroke={color} strokeWidth="1.5" />
      <line x1="46" y1="95" x2="66" y2="95" stroke={color} strokeWidth="1" opacity="0.6" />
      {/* Yorug'lik aksenti */}
      <rect x="36" y="46" width="6" height="92" rx="3" fill="white" opacity="0.25" />
    </svg>
  );
}
