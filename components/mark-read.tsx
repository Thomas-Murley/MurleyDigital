"use client";

import { useEffect } from "react";
import { markMessageRead } from "@/lib/actions";

export function MarkRead({ id }: { id: string }) {
  useEffect(() => {
    void markMessageRead(id);
  }, [id]);
  return null;
}
