import Link from "next/link";

import { ModeToggle } from "@/components/registry/mode-toggle";
import { registry } from "@/lib/registry/site";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  const itemsCount = registry.items.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {registry.name}
          <Badge className="hidden sm:inline-flex">{itemsCount}</Badge>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <Link href="/components" className="transition-colors hover:text-foreground">
            Components
          </Link>
          <Link href="/docs" className="transition-colors hover:text-foreground">
            Docs
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <Link
            href={registry.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}
