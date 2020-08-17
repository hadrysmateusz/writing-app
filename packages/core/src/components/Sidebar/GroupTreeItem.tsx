import React, { useMemo, useCallback, useState, useEffect } from "react"
import styled from "styled-components/macro"
import { Draggable } from "react-beautiful-dnd"
import { Subscription } from "rxjs"

import { StatelessExpandableTreeItem, AddButton } from "../TreeItem"
import {
  useContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from "../ContextMenu"
import { useViewState } from "../View/ViewStateProvider"
import { useEditableText, EditableText } from "../RenamingInput"
import { useDocumentsAPI, useGroupsAPI } from "../MainProvider"
import { GroupsList } from "../GroupsList"

import { formatOptional } from "../../utils"
import { GroupTreeBranch } from "../../helpers/createGroupTree"

const GroupTreeItem: React.FC<{
  group: GroupTreeBranch
  index: number
  depth?: number
}> = ({ group, depth, index }) => {
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const { createDocument, findDocuments } = useDocumentsAPI()
  const { renameGroup, removeGroup } = useGroupsAPI()
  const { primarySidebar } = useViewState()
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)

  const updateIsEmpty = useCallback((documents) => {
    setIsEmpty(documents.length === 0)
  }, [])

  // TODO: this might be unnecessary and could possibly increase costs and/or impact performance
  useEffect(() => {
    if (group.children.length > 0) {
      setIsEmpty(false)
      return
    }

    let documentsSub: Subscription | undefined

    const setup = async () => {
      try {
        const documentsQuery = await findDocuments()
          .where("parentGroup")
          .eq(group.id)

        const newDocuments = await documentsQuery.exec()
        updateIsEmpty(newDocuments)
        documentsSub = documentsQuery.$.subscribe(updateIsEmpty)
      } catch (error) {
        // TODO: handle better in prod
        throw error
      }
    }

    setup()

    return () => {
      if (documentsSub) {
        documentsSub.unsubscribe()
      }
    }
  }, [
    findDocuments,
    group.children.length,
    group.id,
    primarySidebar,
    updateIsEmpty,
  ])

  const { startRenaming, getProps } = useEditableText(
    formatOptional(group.name, ""),
    (value: string) => {
      renameGroup(group.id, value)
    }
  )

  const handleRenameDocument = useCallback(() => {
    closeMenu()
    startRenaming()
  }, [closeMenu, startRenaming])

  const handleNewGroup = useCallback(() => {
    setIsCreatingGroup(true)
    setIsExpanded(true)
  }, [])

  const handleNewDocument = useCallback(() => {
    createDocument(group.id)
  }, [createDocument, group.id])

  const handleDeleteGroup = useCallback(() => {
    removeGroup(group.id)
  }, [group.id, removeGroup])

  const handleClick = useCallback(() => {
    primarySidebar.switchView(group.id)
  }, [group.id, primarySidebar])

  const groupName = useMemo(
    () => formatOptional(group.name, "Unnamed Collection"),
    [group.name]
  )

  const isActive = primarySidebar.currentView === group.id
  const icon = isExpanded
    ? "folderOpen"
    : isEmpty
    ? "folderEmpty"
    : "folderClosed"

  return (
    <>
      <Draggable draggableId={group.id} index={index}>
        {(provided) => {
          return (
            <DraggableWrapper
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <StatelessExpandableTreeItem
                key={group.id}
                depth={depth}
                onContextMenu={openMenu}
                onClick={handleClick}
                isExpanded={isExpanded}
                isActive={isActive}
                setIsExpanded={setIsExpanded}
                icon={icon}
                nested={(depth) => (
                  <GroupsList
                    depth={depth}
                    group={group}
                    isCreatingGroup={isCreatingGroup}
                    setIsCreatingGroup={setIsCreatingGroup}
                  />
                )}
              >
                <EditableText {...getProps()}>{groupName}</EditableText>
                <AddButton groupId={group.id} />
              </StatelessExpandableTreeItem>
            </DraggableWrapper>
          )
        }}
      </Draggable>
      {isMenuOpen && (
        <ContextMenu>
          <ContextMenuItem onClick={handleRenameDocument}>
            Rename
          </ContextMenuItem>
          {/* TODO: add danger style option to ContextMenuItem */}
          <ContextMenuItem onClick={handleDeleteGroup}>Delete</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleNewDocument}>
            New Document
          </ContextMenuItem>
          <ContextMenuItem onClick={handleNewGroup}>
            New Collection
          </ContextMenuItem>
        </ContextMenu>
      )}
    </>
  )
}

export default GroupTreeItem

const DraggableWrapper = styled.div``
