/**
 * Small utility to provide a placeholder for text values that might be empty
 */

export const formatOptional = (text: string, placeholder: string) => {
  const trimmedText = text.trim()
  return trimmedText === "" ? placeholder : trimmedText
}
