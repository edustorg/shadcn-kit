export function extractAxiosErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  // Check if it's an Axios-like error with response data
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    typeof (error as any).response === "object"
  ) {
    const responseData = (error as any).response?.data

    if (responseData) {
      const message = responseData.message
      const nestError = responseData.error

      // If message is a string
      if (typeof message === "string" && message.trim()) {
        return message
      }

      // If message is an array of validation errors (NestJS ValidationPipe)
      if (Array.isArray(message)) {
        return message.join(", ")
      }

      // Fallback to `error` field if available
      if (typeof nestError === "string" && nestError.trim()) {
        return nestError
      }
    }
  }

  // Check for plain JS Error object
  if (error instanceof Error && error.message) {
    return error.message
  }

  // As a last resort, attempt to stringify
  if (typeof error === "string") {
    return error
  }

  return fallback
}
