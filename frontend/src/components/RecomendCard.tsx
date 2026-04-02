import Image from 'next/image';

type RecomendCardProps = {
  name: string;
  pieces: string;
  price: string;
  image: string;
  compact?: boolean;
};

export default function RecomendCard({ name, pieces, price, image, compact }: RecomendCardProps) {
  if (compact) {
    return (
      <div
        className="flex flex-col items-center cursor-pointer rounded-2xl pb-3 shrink-0"
        style={{ backgroundColor: '#EDE5D6', width: 120, height: 190 }}>
        <div className="flex items-center justify-center" style={{ width: 100, height: 100 }}>
          <Image src={image} alt={name} width={80} height={80} />
        </div>
        <span className="text-xs font-semibold text-center leading-tight line-clamp-2 w-full px-2">
          {name}
        </span>
        <span className="text-[10px] mt-1" style={{ color: '#7A7A7A' }}>
          {pieces}
        </span>
        <span className="text-sm font-bold mt-auto">{price}</span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center cursor-pointer rounded-3xl pb-3.5"
      style={{ backgroundColor: '#EDE5D6' }}>
      <div
        className="w-full flex items-center justify-center mb-2"
        style={{ width: 140, height: 140 }}>
        <Image src={image} alt={name} width={110} height={110} />
      </div>
      <span className="text-sm font-semibold">{name}</span>
      <span className="text-xs mt-2" style={{ color: '#7A7A7A' }}>
        {pieces}
      </span>
      <span className="text-base font-bold mt-9">{price}</span>
    </div>
  );
}
