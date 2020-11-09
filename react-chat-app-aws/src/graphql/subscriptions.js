/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMessageByRoomId = /* GraphQL */ `
  subscription OnCreateMessageByRoomId($roomId: ID) {
    onCreateMessageByRoomId(roomId: $roomId) {
      id
      content
      owner
      createdAt
      roomId
    }
  }
`;
export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom {
    onCreateRoom {
      id
      name
      createdAt
    }
  }
`;

export const onCreateScoreByRoomId = /* GraphQL */ `
  subscription OnCreateScoreByRoomId($roomId: ID) {
    onCreateScoreByRoomId(roomId: $roomId) {
      id
      content
      owner
      createdAt
      roomId
    }
  }
`;