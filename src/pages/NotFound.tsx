import { Link } from "react-router-dom";
import { FaCompass, FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#fff9ee] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 space-y-6 text-center">
          <div className="text-9xl font-bold text-[#F4B860]">404</div>

          <div className="space-y-2">
            <FaCompass className="mx-auto text-6xl text-gray-400" />
            <h1 className="text-3xl font-bold text-gray-800">Page Not Found</h1>
            <p className="text-gray-500">
              Oops! The page you're looking for seems to have wandered off.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center w-full bg-[#F4B860] hover:bg-[#e3a24f] text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.01] shadow-md hover:shadow-lg gap-2"
          >
            <FaHome />
            Return Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
