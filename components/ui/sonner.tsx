"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  // #region agent log
  let themeResult;
  try {
    themeResult = useTheme();
    fetch('http://127.0.0.1:7242/ingest/8f84f473-30d1-46b4-8242-a409effc4f47',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sonner.tsx:Toaster',message:'useTheme called',data:{theme:themeResult?.theme},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error(String(e));
    fetch('http://127.0.0.1:7242/ingest/8f84f473-30d1-46b4-8242-a409effc4f47',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'sonner.tsx:Toaster',message:'useTheme ERROR',data:{error:error.message,stack:error.stack?.substring(0,300)},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    throw error;
  }
  const { theme = "system" } = themeResult;
  // #endregion

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
