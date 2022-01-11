import { Option } from "./types"

export function getQueryPartsFromQuery(query: string): string[] {
  const trimmedQuery = query.trim()
  const lowerCasedQuery = trimmedQuery.toLowerCase()
  const queryParts = lowerCasedQuery.split(" ")
  const trimmedQueryParts = queryParts.map((part) => part.trim())

  return trimmedQueryParts
}

export function getMatchCountForSuggestion(
  suggestion: Option,
  queryParts: string[]
): number {
  return queryParts.reduce<number>((partMatches, queryPart) => {
    const lowerCasedLabel = suggestion.label.toLowerCase()

    const doesSuggestionContainQueryPart =
      lowerCasedLabel.indexOf(queryPart) !== -1

    return doesSuggestionContainQueryPart ? (partMatches += 1) : partMatches
  }, 0)
}

export function getMatchCountsForSuggestions(
  suggestions: Option[],
  queryParts: string[]
): Map<Option, number> {
  const matchCountMap = new Map<Option, number>()

  suggestions.forEach((suggestion) => {
    const matchCountForSuggestion = getMatchCountForSuggestion(
      suggestion,
      queryParts
    )

    matchCountMap.set(suggestion, matchCountForSuggestion)
  })

  return matchCountMap
}

export function getSuggestionsMatchingQueryPartCount(
  suggestions: Option[],
  matchCountsMap: Map<Option, number>,
  queryPartCount: number
) {
  return suggestions.filter((suggestion) => {
    const matchCount = matchCountsMap.get(suggestion)
    if (matchCount === undefined) {
      // TODO: throwing error because this should never happen anyway, but maybe there's a better way to handle this
      console.warn("No match count in Map for", suggestion)
      throw new Error(
        "No match count for this suggestion, see console for details."
      )
    }
    return matchCount === queryPartCount
  })
}

export function getSuggestionsMatchingQuery(
  suggestions: Option[],
  query: string
) {
  const queryParts = getQueryPartsFromQuery(query)

  const matchCountsMap = getMatchCountsForSuggestions(suggestions, queryParts)

  // Filter out suggestions that don't contain the user's input
  const filtered = getSuggestionsMatchingQueryPartCount(
    suggestions,
    matchCountsMap,
    queryParts.length
  )

  return filtered
}
