import React from 'react'

import { ListItem, ListItemHeader, ListItemBody } from 'ui'

const TopicsListItem = ({ topic, onTopicClick, isActive }) => {
  const { id, name, description } = topic

  // TODO wrap these into generic HOCs
  const handleTopicClick = e => {
    e.preventDefault()
    onTopicClick(id)
  }

  return (
    <ListItem onClick={handleTopicClick} active={isActive} cursorPointer>
      <ListItemHeader>{name}</ListItemHeader>
      <ListItemBody>{description}</ListItemBody>
    </ListItem>
  )
}

export default TopicsListItem
