import { truncateTxHash } from "@filedgr/web-core/format";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";

interface CopyableHashProps {
  value: string;
  /** Number of leading/trailing characters to keep when shortening. */
  chars?: number;
  /** Pre-formatted label; defaults to the shortened value. */
  display?: string;
  className?: string;
}

export const CopyableHash: React.FC<CopyableHashProps> = ({
  value,
  chars = 6,
  display,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied!" : value}
      className={`inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-glow-50 ${className}`}
    >
      <span>{display ?? truncateTxHash(value, chars, chars)}</span>
      {copied ? (
        <Check className="h-3 w-3 text-trellis-400" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );
};

export default CopyableHash;
