/* eslint-disable @typescript-eslint/naming-convention */
import { gql, useSubscription } from '@apollo/client';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import cc from 'classcat';
import { CreateChatRoom } from 'src/components/ChatRoom/create';
import { ChatRoomCard } from 'src/components/ChatRoomCard';
import { Layout } from 'src/components/Layout';
import type { ChatRoomWithUsersMessages } from 'src/types/chat';

const CHATROOM_SUBSCRIPTION = gql`
  subscription MySubscription($_eq: String) {
    chatRooms(where: { participants: { userId: { _eq: $_eq } } }) {
      id
      name
      createdAt
      messages(order_by: { createdAt: desc }) {
        text
        chatRoomId
      }
      participants {
        userId
      }
    }
  }
`;

const CreateRooms = () => {
  const { user } = useUser();

  const { data: subscriptionChatRoom, loading: isLoading } = useSubscription(
    CHATROOM_SUBSCRIPTION,
    {
      variables: {
        _eq: user?.sub,
      },
    }
  );
  const arrayChatRoom: ChatRoomWithUsersMessages[] =
    subscriptionChatRoom?.chatRooms;

  // eslint-disable-next-line no-console
  console.log(arrayChatRoom);

  return (
    <Layout>
      <div
        className={cc([
          '-mb-16 h-screen w-full duration-300 sm:py-8 sm:px-4',
          isLoading === true ? 'animate-pulse bg-blue-200' : 'bg-blue-300',
        ])}>
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {arrayChatRoom?.map((room) => {
            return (
              <div key={room.id}>
                <ChatRoomCard {...room} />
              </div>
            );
          })}
        </div>
        <div className="block sm:hidden w-full">
          {arrayChatRoom?.map((room) => {
            return (
              <div key={room.id}>
                <ChatRoomCard {...room} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-8 mr-14 md:mr-64 h-full">
        <div className="fixed right-6 sm:right-10 bottom-6 sm:bottom-10">
          <CreateChatRoom />
        </div>
      </div>
    </Layout>
  );
};

export default withPageAuthRequired(CreateRooms);
