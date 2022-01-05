import { memo, useMemo } from "react"

import { useQuery } from "../../../hooks"

import { Option } from "../../Autocomplete"
import { useGenericDocumentsFromCloudDocumentsQuery } from "../../PrimarySidebar/Cloud/hooks"
import { SearchBox } from "../../SearchBox"

import { SectionContainer } from "../Common"

export const SearchSection: React.FC = memo(() => {
  // TODO: use query with sorting but first move sorting provider much higher up
  const query = useQuery(
    (db) => db.documents.findNotRemoved().sort({ titleSlug: "asc" }),
    []
  )

  const [flatDocuments] = useGenericDocumentsFromCloudDocumentsQuery(query)

  const options = useMemo(() => {
    let options: Option[] = flatDocuments.map((doc) => ({
      value: doc.identifier,
      label: doc.name,
      disabled: false,
    }))
    return options
  }, [flatDocuments])

  return (
    <SectionContainer>
      <SearchBox options={options} />
    </SectionContainer>
  )
})
