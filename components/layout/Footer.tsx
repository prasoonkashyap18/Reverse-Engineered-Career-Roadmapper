import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <span>{siteConfig.name} — LLOYD Hackathon, Problem Statement 1</span>
        <span>Built with Next.js, TypeScript, and Tailwind CSS.</span>
      </div>
    </footer>
  );
}
