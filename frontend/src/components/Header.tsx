import { RxHamburgerMenu } from 'react-icons/rx';
import { CiShoppingCart } from 'react-icons/ci';

export default function Header() {
  return (
    <header className="px-50.5 fixed top-0 left-0 right-0 z-10 flex items-center justify-between">
      <div className="max-w-7xl    flex items-center ">
        <h1
          className="text-5xl font-semibold text-gray-900 mr-20.5"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          ROLLI
        </h1>

        <div className="flex space-x-7 ">
          <a>О нас</a>
          <a>Каталог</a>
        </div>
      </div>
      <div className="py-6 flex items-center space-x-14">
        <a href="tel:+79123434412">+7 912 343 44-12</a>

        <div className="flex space-x-9">
          <RxHamburgerMenu size={31} />
          <CiShoppingCart size={31} />
        </div>
      </div>
    </header>
  );
}
