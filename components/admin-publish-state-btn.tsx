"use client";

import { useTransition } from "react";
import { publishStateAction, unpublishStateAction } from "@/app/admin/states/actions";
import { Upload, RotateCcw, Loader2 } from "lucide-react";

interface Props {
  stateId: string;
  draft: number;
  published: number;
}

export default function AdminPublishStateBtn({ stateId, draft, published }: Props) {
  const [isPending, startTransition] = useTransition();

  if (draft === 0 && published > 0) {
    // Fully published — offer unpublish
    return (
      <button
        disabled={isPending}
        onClick={() => startTransition(() => unpublishStateAction(stateId))}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-wur-danger transition-colors disabled:opacity-50"
        title="Revert all to draft"
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
        Unpublish
      </button>
    );
  }

  if (draft === 0) return null;

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => publishStateAction(stateId))}
      className="inline-flex items-center gap-1.5 text-xs font-medium bg-wur-teal text-white px-2.5 py-1 rounded-lg hover:bg-wur-teal/90 transition-colors disabled:opacity-50"
      title={`Publish ${draft} draft utilities`}
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
      {isPending ? "Publishing…" : `Publish ${draft.toLocaleString()}`}
    </button>
  );
}
