import { getRegistryCatalogJson } from "@/lib/registry/json";

export function GET() {
  return Response.json(getRegistryCatalogJson());
}
