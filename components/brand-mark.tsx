import Image from "next/image";

/** The selected Fieldnote icon paired with the Front Brief wordmark. */
export function BrandMark({
  iconWidth = 42,
  iconHeight = 20,
}: {
  iconWidth?: number;
  iconHeight?: number;
}) {
  return (
    <span className="inline-flex items-center gap-2 font-semibold">
      <Image
        src="/brand/front-brief-mark.svg"
        alt=""
        aria-hidden="true"
        width={iconWidth}
        height={iconHeight}
        className="shrink-0"
      />
      <span>Front Brief</span>
    </span>
  );
}
