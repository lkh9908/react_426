import React, {useState} from 'react'
import gql from 'graphql-tag'
import { useMutation} from '@apollo/react-hooks'

import {Button, Confirm, Icon} from 'semantic-ui-react'

function DeleteButton({postID}){
    const [confirmOpen, setConfirmOpen] = useState(false)

    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(){
            setConfirmOpen (false)
            // TODO: remove post form cache
        },
        variables: {
            postID
        }
    })
    
return (
    <>
        <Button 
            as = "div" 
            color = "youtube"
            floated = "right"
            onClick={()=>setConfirmOpen(true)} >
            <Icon name = "trash" style = {{margi: 0}}></Icon>
        </Button>
        <Confirm
            open= {confirmOpen}
            onCancel={()=>setConfirmOpen(false)}
            onConfirm={deletePost}
        />
    </>
    )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        userName
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton