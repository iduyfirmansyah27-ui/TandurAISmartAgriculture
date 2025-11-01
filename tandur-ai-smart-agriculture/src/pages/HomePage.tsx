import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Selamat Datang di Tandur AI
          </h1>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-2xl sm:max-w-3xl sm:mx-auto md:mt-5">
            Solusi Pertanian Cerdas Berbasis Kecerdasan Buatan
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
