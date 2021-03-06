/* eslint-disable react/display-name */
import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import type { ChangeEventHandler, MouseEventHandler, VFC } from 'react';
import { Fragment, memo } from 'react';
import { MessageForm } from 'src/components/MessageForm';
import type { SubMessage } from 'src/types/chat';

type Props = {
  show: boolean;
  onClose: () => void;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onClick: MouseEventHandler<HTMLButtonElement>;
  title: string;
  messages: SubMessage[];
  value: string | number | undefined;
};

export const SubMessageBox: VFC<Props> = memo((props) => {
  return (
    <Transition appear show={props.show} as={Fragment}>
      <Dialog
        as="div"
        className="overflow-y-auto fixed inset-0 z-50"
        onClose={props.onClose}>
        <div className="px-4 min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className="inline-block overflow-hidden p-6 my-8 w-full max-w-md text-left align-middle bg-white rounded-2xl shadow-xl transition-all transform">
              <Dialog.Title
                as="h3"
                className="text-lg font-semibold text-blue-500">
                {props.title.slice(0, 20)}...
              </Dialog.Title>
              <div className="overflow-y-scroll mt-2 h-full max-h-[300px]">
                {props.messages.map((data) => {
                  return (
                    <div
                      key={data.id}
                      className="p-4 text-sm sm:text-base hover:bg-blue-50 border-b border-blue-200 duration-200">
                      <div className="flex items-center w-full">
                        <div className="mr-4 min-w-[2.5rem]">
                          <img
                            src={data.imageUrl}
                            alt="My profile"
                            className="w-10 h-10 rounded-full"
                          />
                        </div>
                        <div>
                          <div className="flex flex-col justify-center">
                            <p className="font-bold text-gray-600">
                              {data.name}
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-blue-400">
                              {format(
                                new Date(data.createdAt),
                                'yyyy/MM/dd HH:mm'
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 ml-14 whitespace-pre-wrap">
                        {data.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 h-14">
                <MessageForm
                  onChange={props.onChange}
                  value={props.value}
                  placeholder={`${props.title} ?????????`}
                  onClick={props.onClick}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
});
