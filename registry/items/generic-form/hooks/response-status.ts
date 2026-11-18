/**
 * The HTTP status of a failed request, or `undefined` when the failure never
 * reached the server — a transport error, a thrown string, an aborted request.
 *
 * `axios.create` does not copy the statics, so an instance has no
 * `isAxiosError`; this reads the response shape instead of the constructor.
 */
export function responseStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return undefined
  }
  const { status } =
    (error as { response?: { status?: number } }).response ?? {}
  return typeof status === "number" ? status : undefined
}
