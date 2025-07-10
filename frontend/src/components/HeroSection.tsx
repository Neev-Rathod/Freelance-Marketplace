import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[radial-gradient(circle,_#03182d,_#080d14)]">
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-6xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Find the Perfect
          <span className="text-blue-500"> Freelancer</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Connect with skilled professionals from around the world. Get your
          projects done efficiently and affordably.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Get Started
          </Link>
          <Link
            to="/how-it-works"
            className="border-2 border-slate-300 text-slate-300 hover:bg-slate-300 hover:text-slate-900 px-12 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:shadow-lg"
          >
            How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}
