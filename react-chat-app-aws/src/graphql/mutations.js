/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createRoom = /* GraphQL */ `
  mutation CreateRoom(
    $input: RoomInput!
  ) {
    createRoom(input: $input) {
      id
      name
      createdAt
    }
  }
`;


export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: MessageInput!
  ) {
    createMessage(input: $input) {
      id
      content
      owner
      createdAt
      roomId
    }
  }
`;

export const createScore = /* GraphQL */ `
  mutation CreateScore(
    $input: ScoreInput!
  ) {
    createScore(input: $input) {
      id
      content
      owner
      createdAt
      roomId
    }
  }
`;
