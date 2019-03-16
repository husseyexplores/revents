import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Segment, Comment, Header } from 'semantic-ui-react'
import distanceInWords from 'date-fns/distance_in_words'

import EventDetailedChatForm from './EventDetailedChatForm'

function EventDetailedChat({ addEventComment, eventId, eventChat }) {
  const [showReply, setShowReply] = useState(false)
  const [selectedCommentId, setSelectedCommentId] = useState(null)

  const toggleShowReply = id => () => {
    if (showReply) {
      setShowReply(false)
      setSelectedCommentId(null)
    } else {
      setShowReply(true)
      setSelectedCommentId(id)
    }
  }

  return (
    <div>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>

      <Segment attached>
        <Comment.Group>
          {eventChat.length > 0 &&
            eventChat.map(comment => (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.photoURL || '/assets/user.png'} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${comment.uid}`}>
                    {comment.displayName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>{distanceInWords(comment.date, Date.now())} ago</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.text}</Comment.Text>
                  <Comment.Actions>
                    <Comment.Action onClick={toggleShowReply(comment.id)}>
                      {showReply && selectedCommentId === comment.id
                        ? 'Close reply'
                        : 'Reply'}
                    </Comment.Action>
                    {showReply && selectedCommentId === comment.id && (
                      <EventDetailedChatForm
                        addEventComment={addEventComment}
                        eventId={eventId}
                        form={`reply_${comment.id}`}
                        toggleForm={toggleShowReply(comment.id)}
                        parentId={comment.id}
                      />
                    )}
                  </Comment.Actions>
                </Comment.Content>

                <Comment.Group>
                  {comment.childNodes.length > 0 &&
                    comment.childNodes.map(childCmnt => (
                      <Comment key={childCmnt.id}>
                        <Comment.Avatar
                          src={childCmnt.photoURL || '/assets/user.png'}
                        />
                        <Comment.Content>
                          <Comment.Author
                            as={Link}
                            to={`/profile/${childCmnt.uid}`}
                          >
                            {childCmnt.displayName}
                          </Comment.Author>
                          <Comment.Metadata>
                            <div>
                              {distanceInWords(childCmnt.date, Date.now())} ago
                            </div>
                          </Comment.Metadata>
                          <Comment.Text>{childCmnt.text}</Comment.Text>
                          <Comment.Actions>
                            <Comment.Action
                              onClick={toggleShowReply(childCmnt.id)}
                            >
                              {showReply && selectedCommentId === childCmnt.id
                                ? 'Close reply'
                                : 'Reply'}
                            </Comment.Action>
                            {showReply &&
                              selectedCommentId === childCmnt.id && (
                                <EventDetailedChatForm
                                  addEventComment={addEventComment}
                                  eventId={eventId}
                                  form={`reply_${childCmnt.id}`}
                                  toggleForm={toggleShowReply(childCmnt.id)}
                                  parentId={childCmnt.parentId}
                                />
                              )}
                          </Comment.Actions>
                        </Comment.Content>
                      </Comment>
                    ))}
                </Comment.Group>
              </Comment>
            ))}
        </Comment.Group>

        <EventDetailedChatForm
          parentId={0}
          addEventComment={addEventComment}
          eventId={eventId}
          form="newComment"
        />
      </Segment>
    </div>
  )
}

EventDetailedChat.propTypes = {
  eventId: PropTypes.string.isRequired,
  addEventComment: PropTypes.func.isRequired,
  eventChat: PropTypes.array.isRequired,
}

export default EventDetailedChat
