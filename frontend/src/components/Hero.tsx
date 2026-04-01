import Image from 'next/image';

export default function Hero() {
  return (
    <section className="px-50.5 pt-67.5 flex items-center justify-between bg-white rounded-2xl py-27 relative overflow-hidden">
      <div
        className="absolute rounded-full -left-50 -top-40 z-0"
        style={{
          width: 550,
          height: 542,
          backgroundColor: '#D5715D',
          filter: 'blur(178px)',
          opacity: 0.4,
        }}
      />

      <div
        className="absolute rounded-full -right-50 -top-50% z-0"
        style={{
          width: 550,
          height: 542,
          backgroundColor: '#D5715D',
          filter: 'blur(178px)',
          opacity: 0.4,
        }}
      />
      <Image
        src="/images/hero.png"
        alt="Hero Image"
        width={900}
        height={620}
        className="absolute right-0  z-0"
        style={{ bottom: '-20px' }}
      />
      <div className="max-w-7xl flex flex-col items-start space-y-24 overflow-hidden">
        <h1
          className="max-w-4xl mb-4.5 z-10"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 64,
            fontWeight: 600,
            lineHeight: '135.1%',
            letterSpacing: '0.03em',
          }}>
          Доставка роллов от Rolli, которые хочется заказывать снова
        </h1>
        <p
          className="text-2xl max-w-3xl"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 20,
            fontWeight: 400,
            lineHeight: '170%',
            letterSpacing: '0.03em',
          }}>
          В Rolli мы готовим из свежих ингредиентов и доставляем по <b>Оренбургу</b> в течение 60
          минут — быстро, аккуратно и вкусно
        </p>

        <div className="flex space-x-4">
          <button className="bg-gray-900 text-white px-6 py-3 rounded-md">Заказать сейчас</button>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-md">Смотреть меню</button>
        </div>
      </div>
    </section>
  );
}
