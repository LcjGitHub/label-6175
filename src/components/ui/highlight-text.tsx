import * as React from "react";
import { cn, getHighlightSegments } from "@/lib/utils";

export interface HighlightTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  keyword: string;
  highlightClassName?: string;
}

/**
 * 高亮文本组件，根据关键词高亮显示匹配部分
 * 使用琥珀色主题色作为高亮背景
 */
function HighlightText({
  text,
  keyword,
  className,
  highlightClassName,
  ...props
}: HighlightTextProps) {
  const segments = getHighlightSegments(text, keyword);

  return (
    <span className={cn(className)} {...props}>
      {segments.map((segment, index) =>
        segment.isHighlight ? (
          <mark
            key={index}
            className={cn(
              "rounded px-0.5 text-radio-wood font-medium",
              "bg-radio-amber/90",
              highlightClassName
            )}
          >
            {segment.text}
          </mark>
        ) : (
          <React.Fragment key={index}>{segment.text}</React.Fragment>
        )
      )}
    </span>
  );
}

export { HighlightText };
