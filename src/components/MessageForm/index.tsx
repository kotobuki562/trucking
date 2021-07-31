/* eslint-disable react/display-name */
import type { ChangeEventHandler, MouseEventHandler, VFC } from 'react';
import { memo } from 'react';

type Props = {
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  value: string | number | undefined;
  placeholder?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const MessageForm: VFC<Props> = memo((props) => {
  return (
    <div className="flex items-center w-full h-full">
      <textarea
        onChange={props.onChange}
        value={props.value}
        placeholder={props.placeholder}
        className="p-2 w-full h-full bg-blue-200 duration-200 focus:outline-none resize-none"
      />
      <button
        className="py-2 px-4 h-full text-white whitespace-nowrap bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 duration-200 focus:outline-none active:outline-none"
        onClick={props.onClick}>
        送信
      </button>
    </div>
  );
});
