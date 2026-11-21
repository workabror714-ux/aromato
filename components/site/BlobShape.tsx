type BlobShapeProps = {
  className?: string;
  fill?: string;
};

/**
 * Takrorlanuvchi organik shakl — Hero, Brend tarixi va Signature
 * bo'limlarida mahsulot illyustratsiyasi ortida fon sifatida ishlatiladi.
 * Bu bitta izchil vizual motiv sifatida sahifani bir-biriga bog'laydi.
 */
export function BlobShape({ className, fill = "var(--clay-faint)" }: BlobShapeProps) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <path
        fill={fill}
        d="M317.5 73.5Q360 147 345.5 218.5Q331 290 263 330.5Q195 371 126 335.5Q57 300 42.5 222Q28 144 79 90Q130 36 203 33.5Q276 31 317.5 73.5Z"
      />
    </svg>
  );
}
