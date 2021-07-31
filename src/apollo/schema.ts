import { gql } from '@apollo/client';

const ADD_MESSAGE = gql`
  mutation MyMutation(
    $chatRoomId: uuid
    $createdAt: String!
    $imageUrl: String!
    $name: String!
    $text: String!
    $userId: String!
  ) {
    insert_messages_one(
      object: {
        chatRoomId: $chatRoomId
        createdAt: $createdAt
        imageUrl: $imageUrl
        messages: []
        name: $name
        text: $text
        userId: $userId
      }
    ) {
      chatRoomId
      userId
      text
      name
      messages
      imageUrl
      createdAt
    }
  }
`;

export { ADD_MESSAGE };
