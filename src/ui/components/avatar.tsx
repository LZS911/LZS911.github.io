import Image, { ImageProps } from 'next/image';

type Props = {
  name: string;
  picture: string;
  showName?: boolean;
} & Omit<ImageProps, 'src' | 'alt'>;

const Avatar: React.FC<Props> = ({ name, picture, showName, ...props }) => {
  return (
    <div className="flex items-center">
      <Image src={picture} className=" rounded-full" alt={name} {...props} />
      {showName ? <div className="text-xl font-bold">{name}</div> : null}
    </div>
  );
};

export default Avatar;
