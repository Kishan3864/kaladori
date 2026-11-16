/**
 * Draw-on-hover underline for text inside a larger tap target. Put `group`
 * on the interactive element and this on the inner text span, so the line
 * hugs the text rather than the bottom of a 44px hit area.
 */
export const groupUnderline =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 ease-editorial group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]";
