/**
 * Small utility to provide a placeholder for text values that might be empty or undefined
 *
 * It also checks if the trimmed string is empty to prevent visually empty strings
 */

export const formatOptional = (
  text: string | undefined | null,
  placeholder: string
) => {
  const trimmedText = text ? text.trim() : ""
  return trimmedText === "" ? placeholder : trimmedText
}
