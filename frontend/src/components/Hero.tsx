import Image from 'next/image';
import { CiClock2 } from 'react-icons/ci';

export default function Hero() {
  return (
    <section className="bg-white">
      <div
        className="px-39 pt-47 flex items-center justify-between rounded-2xl py-25.5 relative overflow-hidden"
        style={{
          backgroundImage: 'url(/images/bg-hero.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
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
          src="/images/hero1.png"
          alt="Hero Image"
          width={955}
          height={775}
          className="absolute right-0  z-1"
          style={{ bottom: '-22px' }}
        />

        <Image
          src="/images/sushi1.png"
          alt="Hero Image"
          width={265}
          height={265}
          className="absolute right-30  z-2 animate-levitate"
          style={{ bottom: '20px' }}
        />

        <Image
          src="/images/sushi2.png"
          alt="Hero Image"
          width={265}
          height={265}
          className="absolute right-175  z-0 animate-levitate-slow"
          style={{ top: '250px' }}
        />

        <Image
          src="/images/sushi3.png"
          alt="Hero Image"
          width={215}
          height={215}
          className="absolute right-110  z-3 animate-levitate-fast"
          style={{ top: '70px' }}
        />
        <div className="max-w-7xl flex flex-col items-start space-y-24 overflow-hidden">
          <h1
            className=" mb-4.5 z-10"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 64,
              fontWeight: 600,
              lineHeight: '135.1%',
              letterSpacing: '0.03em',
              maxWidth: 971,
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
            <button
              className="text-white font-semibold text-2xl z-10 cursor-pointer p-5"
              style={{
                width: 366,
                borderRadius: 67,
                background: 'linear-gradient(90deg, #D46D5A 0%, #DA896C 50%, #DBA780 100%)',
                border: '2px solid #DA896C',
                boxShadow: '0px 0px 36px 0px rgba(212, 112, 92, 0.2)',
              }}>
              Заказать сейчас
            </button>
            <button
              className="text-black font-bold text-xl z-10 cursor-pointer p-5 transition-colors hover:bg-gray-100"
              style={{
                width: 300,
                borderRadius: 67,
                border: '2px solid #DA896C',
              }}>
              Смотреть меню
            </button>
          </div>
        </div>
      </div>
      <div
        className="flex items-center space-x-2 py-4 items-center justify-center text-white z-10 text-2xl font-light"
        style={{
          backgroundColor: '#343943',
          fontFamily: 'Montserrat, sans-serif',
        }}>
        <CiClock2 size={34} />
        <span className="font-bold mr-2">Готовим с 9:00 до 22:00.</span>
        Можно сделать предзаказ.
      </div>
    </section>
  );
}
