import { memo } from "react";
import { ArrowDown } from "lucide-react";
import { useUserLang } from "@/lib/authI18n";

interface ScrollToBottomButtonProps {
  visible: boolean;
  newMessagesCount: number;
  onClick: () => void;
}

/**
 * Floating "jump to latest" control.
 *
 * The transcript sets `overflow-anchor: none` (the thinking panel is swapped
 * for the answer mid-reply, which otherwise shifts the view), so a reader who
 * scrolls up during a long stream has no browser-driven way back to the live
 * text. This button is that way back.
 */
const ScrollToBottomButtonImpl = ({
  visible,
  newMessagesCount,
  onClick,
}: ScrollToBottomButtonProps) => {
  const ar = useUserLang() === "ar-eg";
  if (!visible) return null;
  const aria = ar ? "انزل لآخر المحادثة" : "Jump to latest";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={aria}
      title={aria}
      className="sticky bottom-4 z-30 mx-auto flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full border border-border/60 bg-popover/90 px-3 text-popover-foreground shadow-lg backdrop-blur-xl transition-colors hover:bg-accent hover:text-accent-foreground motion-safe:animate-in motion-safe:fade-in-0"
    >
      <ArrowDown className="h-4 w-4" strokeWidth={2} />
      {newMessagesCount > 0 && (
        <span className="text-[12.5px] font-semibold tabular-nums">{newMessagesCount}</span>
      )}
    </button>
  );
};

export const ScrollToBottomButton = memo(ScrollToBottomButtonImpl);

export default ScrollToBottomButton;
