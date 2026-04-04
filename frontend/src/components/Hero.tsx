import Image from 'next/image';
import { CiClock2 } from 'react-icons/ci';

export default function Hero({ onOrderClick }: { onOrderClick?: () => void }) {
  return (
    <section className="bg-white">
      <div
        className="px-4 md:px-8 lg:px-16 xl:px-39 pt-20 md:pt-28 lg:pt-36 xl:pt-47 pb-0 md:pb-16 lg:pb-20 xl:pb-25.5 flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl relative overflow-hidden"
        style={{
          backgroundImage: 'url(/images/bg-hero.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
        {/* Glow blobs */}
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

        {/* Big hero plate — md and up */}
        <Image
          src="/images/hero1.png"
          alt="Hero Image"
          width={955}
          height={775}
          className="absolute right-0 z-1 hidden md:block w-[500px] lg:w-[700px] xl:w-[955px]"
          style={{ bottom: '-22px' }}
        />

        {/* Floating sushi — desktop positioned absolutely */}
        <Image
          src="/images/sushi1.png"
          alt="Суши"
          width={265}
          height={265}
          className="absolute right-4 lg:right-30 z-2 animate-levitate hidden md:block w-[140px] lg:w-[200px] xl:w-[265px]"
          style={{ bottom: '20px' }}
        />
        <Image
          src="/images/sushi2.png"
          alt="Суши"
          width={265}
          height={265}
          className="absolute right-[40%] lg:right-175 z-0 animate-levitate-slow hidden md:block w-[120px] lg:w-[200px] xl:w-[265px]"
          style={{ top: '250px' }}
        />
        <Image
          src="/images/sushi3.png"
          alt="Суши"
          width={215}
          height={215}
          className="absolute right-[20%] lg:right-110 z-3 animate-levitate-fast hidden md:block w-[90px] lg:w-[160px] xl:w-[215px]"
          style={{ top: '70px' }}
        />

        {/* Text content */}
        <div className="max-w-7xl flex flex-col items-start space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-18 xl:space-y-24 z-10">
          <h1
            className="mb-1 md:mb-4.5 text-[22px] sm:text-2xl md:text-4xl lg:text-5xl xl:text-[64px] md:max-w-[60%] lg:max-w-[60%]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              lineHeight: '135.1%',
              letterSpacing: '0.03em',
            }}>
            Доставка роллов от Rolli, которые хочется заказывать снова
          </h1>
          <p
            className="text-sm md:text-base lg:text-lg xl:text-xl max-w-3xl"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 400,
              lineHeight: '170%',
              letterSpacing: '0.03em',
            }}>
            В Rolli мы готовим из свежих ингредиентов и доставляем по <b>Оренбургу</b> в течение 60
            минут — быстро, аккуратно и вкусно
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              className="text-white font-semibold text-base md:text-lg lg:text-xl xl:text-2xl cursor-pointer p-3 md:p-4 lg:p-5 w-full sm:w-auto xl:min-w-[366px]"
              style={{
                borderRadius: 67,
                background: 'linear-gradient(90deg, #D46D5A 0%, #DA896C 50%, #DBA780 100%)',
                border: '2px solid #DA896C',
                boxShadow: '0px 0px 36px 0px rgba(212, 112, 92, 0.2)',
              }}
              onClick={onOrderClick}>
              Заказать сейчас
            </button>
            <a
              href="#catalog"
              className="text-black font-bold text-base md:text-lg lg:text-xl cursor-pointer p-3 md:p-4 lg:p-5 transition-colors hover:bg-gray-100 w-full sm:w-auto xl:min-w-[300px] text-center"
              style={{
                borderRadius: 67,
                border: '2px solid #DA896C',
              }}>
              Смотреть меню
            </a>
          </div>
        </div>

        {/* Mobile sushi images — visible only on mobile, below text */}
        <div className="relative w-full h-[200px] sm:h-[240px] mt-6 md:hidden z-1">
          <Image
            src="/images/sushi1.png"
            alt="Суши"
            width={265}
            height={265}
            className="absolute right-2 bottom-0 w-[110px] sm:w-[140px] animate-levitate z-3"
          />
          <Image
            src="/images/sushi3.png"
            alt="Суши"
            width={215}
            height={215}
            className="absolute right-[30%] sm:right-[40%] top-0 w-[90px] sm:w-[110px] animate-levitate-fast z-2"
          />
          <Image
            src="/images/sushi2.png"
            alt="Суши"
            width={265}
            height={265}
            className="absolute left-4 sm:left-8 bottom-2 w-[100px] sm:w-[130px] animate-levitate-slow z-1"
          />
          {/* Hero plate on mobile — smaller, centered */}
          <Image
            src="/images/hero1.png"
            alt="Hero Image"
            width={955}
            height={775}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[280px] sm:w-[360px] z-2"
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex items-center justify-center space-x-2 py-3 md:py-4 text-white z-10 text-sm md:text-lg lg:text-xl xl:text-2xl font-light px-4"
        style={{
          backgroundColor: '#343943',
          fontFamily: 'Montserrat, sans-serif',
        }}>
        <CiClock2 className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-[34px] xl:h-[34px] shrink-0" />
        <span className="font-bold mr-2">Готовим с 9:00 до 22:00.</span>
        <span className="hidden sm:inline">Можно сделать предзаказ.</span>
      </div>
    </section>
  );
}
