import Image, { ImageProps } from 'next/image';
import EmptyBox from './empty-box';

type Props = {
  name: string;
  picture: string;
  showName?: boolean;
} & Omit<ImageProps, 'src' | 'alt'>;

const Avatar: React.FC<Props> = ({ name, picture, showName, ...props }) => {
  return (
    <div className="flex items-center">
      <Image src={picture} className=" rounded-full" alt={name} {...props} />
      <EmptyBox if={showName}>
        <div className="text-xl font-bold">{name}</div>
      </EmptyBox>
    </div>
  );
};

export default Avatar;
