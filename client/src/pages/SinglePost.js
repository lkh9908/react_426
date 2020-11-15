import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import {
  Button, Card, Form, Grid, Image, Icon, Label, CardContent
} from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
// import DeleteButton from '../components/DeleteButton';
// import MyPopup from '../util/MyPopup';

function SinglePost(props) {
    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null);
    
    const { data: { getPost } } = useQuery(FETCH_POST_QUERY, {
        variables: {
          postId
        }
      });

    let postMarkup;
    if (!getPost) {
        postMarkup = <p>Loading post..</p>;
    } else {
        const {
        id,
        body,
        createdAt,
        userName,
        comments,
        likes,
        likeCount,
        commentCount
    } = getPost;

    postMarkup = (
        <Grid>
            <Grid.Row>
            <Grid.Column width={2}>
                <Image
                src="https://i.pinimg.com/originals/d0/9e/2a/d09e2a6e3ab2e8113b672d304f3a6110.png"
                size="small"
                float="right"
                />
            </Grid.Column>
            <Grid.Column width = {10}>
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{userName}</Card.Header>
                        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>\
                        <Card.Description>{body}</Card.Description>
                    </Card.Content>
                    <hr/>
                    <Card.Content extra>
                        <LikeButton user = {user} post = {{ likeCount, likes, likeCount}}/>
                        <Button as = "div" labelPosition = "right" onClick= {()=>console.log("comment")}>
                            <Button basic color = "blue">
                                <Icon name = "conmments"></Icon>
                            </Button>
                            <Label basic color = "blue" pointing = "left">
                                {commentCount}
                            </Label>
                        </Button>
                        {user && user.userName === userName && (
                            <DeleteButton postId = {id} />
                        )}
                    </Card.Content>
                </Card>
            </Grid.Column>
            </Grid.Row>
        </Grid>
    )
    }
    return postMarkup
}

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      userName
      likeCount
      likes {
        userName
      }
      commentCount
      comments {
        id
        userName
        createdAt
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        userName
      }
      commentCount
    }
  }
`;



export default SinglePost