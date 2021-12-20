import { useEffect } from "react"

import { DirObjectRecursive, ValidatePathsObj } from "shared"

const fetchInitialDirTreeForPath = async (
  path: string
): Promise<DirObjectRecursive | undefined> => {
  const res = await window.electron.invoke("GET_PATH_CONTENTS", { path })

  console.log("GET_PATH_CONTENTS", res)
  if (res.status === "success") {
    return res.data.dirObj
  } else if (res.status === "error") {
    console.log(res.error)
    return undefined
  } else {
    console.log(res)
    throw new Error("something went wrong")
  }
}

export const useFetchInitialDirTrees = (
  dirs: ValidatePathsObj[] | undefined,
  setDirState
) => {
  useEffect(() => {
    if (!dirs) {
      return
    }

    setDirState((prev) => ({ ...prev, isLoading: true }))
    ;(async () => {
      const newDirTrees: DirObjectRecursive[] = []
      for (let dir of dirs) {
        const dirTree = await fetchInitialDirTreeForPath(dir.path)
        if (dirTree) {
          newDirTrees.push(dirTree)
        }
      }
      setDirState({ isLoading: false, dirTrees: newDirTrees })
    })()
  }, [dirs, setDirState])
}
