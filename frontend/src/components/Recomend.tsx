import RecomendCard from './RecomendCard';

const products = [
  { name: 'Филадельфия', pieces: '10 штук', price: '990 руб', image: '/images/recom1.png' },
  { name: 'Запеченые темпура', pieces: '8 штук', price: '290 руб', image: '/images/recom2.png' },
  { name: 'Филадельфия', pieces: '10 штук', price: '990 руб', image: '/images/recom1.png' },
  { name: 'Запеченые темпура', pieces: '8 штук', price: '290 руб', image: '/images/recom2.png' },
  { name: 'Филадельфия', pieces: '10 штук', price: '990 руб', image: '/images/recom1.png' },
  { name: 'Филадельфия', pieces: '10 штук', price: '990 руб', image: '/images/recom1.png' },
];

export default function Recomend() {
  return (
    <div className="px-75" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <h2 className="text-2xl font-bold mb-9">Рекомендуем</h2>
      <div className="grid grid-cols-6 gap-6 overflow-x-auto">
        {products.map((product, index) => (
          <RecomendCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
}
