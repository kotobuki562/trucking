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

// const ADD_CHATROOM = gql`
//   mutation MyMutation(
//     $createdAt: String!
//     $createrId: String!
//     $name: String!
//     $password: String!
//     $users: json = [
//       { id: id, name: name, imageUrl: imageUrl, createdAt: createdAt }
//     ]
//   ) {
//     insert_chatRooms_one(
//       object: {
//         createdAt: $createdAt
//         createrId: $createrId
//         name: $name
//         password: $password
//         users: $users
//       }
//     ) {
//       id
//       createdAt
//       createrId
//       name
//       password
//       users
//     }
//   }
// `;

export { ADD_MESSAGE };
