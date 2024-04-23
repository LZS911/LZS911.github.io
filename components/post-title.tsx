import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

const PostTitle: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex justify-center font-[Arial] max-w-[864px] text-center">
      <h1 className="text-5xl font-bold bg-indigo px-5 py-2 rounded-sm text-shadow-lg  leading-[1.1]">
        {children}
      </h1>
    </div>
  );
};

export default PostTitle;
