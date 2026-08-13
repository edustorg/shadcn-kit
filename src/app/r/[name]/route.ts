import { getRegistryItemJson } from "@/lib/registry/json";

type ItemRouteProps = {
  params: Promise<{ name: string }>;
};

export async function GET(_request: Request, { params }: ItemRouteProps) {
  const { name } = await params;
  const item = getRegistryItemJson(name.replace(/\.json$/, ""));

  if (!item) {
    return Response.json(
      { error: `Registry item "${name}" was not found.` },
      { status: 404 },
    );
  }

  return Response.json(item);
}
