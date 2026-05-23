
import { useEffect } from "react";
import OrbitShowcase from "../components/OrbitShowcase";
import { Link } from "react-router-dom";
import PreviewCharts from "../components/PreviewCharts";


export default function Landing() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty(
        "--x",
        `${e.clientX}px`
      );
      document.documentElement.style.setProperty(
        "--y",
        `${e.clientY}px`
      );
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []); 


    return (
    <main className="min-h-screen text-white bg-linear-to-b from-black via-[#1e1d1d] to-gray-100">

    {/* NAVBAR */}
    <nav className="fixed top-0 left-0 w-full z-50 
      bg-[#0f3d2e]/70 
      backdrop-blur-md 
      border-b border-white/10 
      px-5 md:px-10 py-4 md:py-5
      flex justify-between items-center">

      <h1 className="text-lg md:text-xl font-semibold tracking-wide">
        Task Force Manager
      </h1>

      {/* Hide nav links on mobile */}
      <div className="hidden md:flex gap-8 text-sm text-gray-400">
        {["Home", "Features", "Dashboard", "Docs"].map(item => (
          <span key={item} className="hover:text-white transition cursor-pointer">
            {item}
          </span>
        ))}
        <button className="text-white border border-gray-700 px-4 py-1 rounded-md hover:border-white transition">
          Launch App
        </button>
      </div>
    </nav>


    {/* HERO SECTION */}
    <section className="relative pt-32 md:pt-40 pb-20 md:pb-32 px-5 md:px-20">

      <div className="flex flex-col md:flex-row items-start justify-between gap-16">

        {/* LEFT SIDE */}
        <div className="flex-1">

          <h1
                className="relative text-[42px] md:text-[72px] 
                          font-bold leading-tight tracking-tight 
                          max-w-4xl select-none"
                onMouseMove={(e) => {
                  if (window.innerWidth < 768) return; // disable on mobile

                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    "--mx",
                    `${e.clientX - rect.left}px`
                  );
                  e.currentTarget.style.setProperty(
                    "--my",
                    `${e.clientY - rect.top}px`
                  );
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth < 768) return;
                  e.currentTarget.style.setProperty("--mx", "30%");
                  e.currentTarget.style.setProperty("--my", "50%");
                }}
              >

            <span className="block text-gray-700">CONTROL TASKS</span>
            <span className="block text-gray-700">ALIGN TEAMS</span>
            <span className="block text-gray-700">EXECUTE WITH CLARITY</span>

            <span className="pointer-events-none absolute inset-0 gradient-mask">
              <span className="block">CONTROL TASKS</span>
              <span className="block">ALIGN TEAMS</span>
              <span className="block">EXECUTE WITH CLARITY</span>
            </span>
          </h1>

          <p className="mt-6 text-gray-400 max-w-xl text-sm md:text-base">
            A focused task force manager built for real operations.
          </p>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 md:gap-6">
            <Link
              to="/tasks"
              className="border border-gray-700 bg-white text-black 
                         px-5 py-3 md:py-4 text-lg md:text-2xl 
                         rounded-md hover:bg-black hover:text-white 
                         transition text-center"
            >
              View Dashboard
            </Link>
          </div>

          {/* SUPPORT TEXT */}
          <div className="mt-20 md:mt-64 max-w-lg">
            <h2 className="text-2xl md:text-4xl font-semibold mb-4">
              Every Task In Motion
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              From planning to execution, your workflow stays aligned and visible.
              Priorities shift. Teams adapt. Progress remains clear.
            </p>
          </div>

        </div>

        {/* RIGHT ORBIT */}
        <div className="flex-1 flex justify-center md:justify-end 
                        mt-16 md:mt-40 
                        scale-100 md:scale-110">
          <OrbitShowcase />
        </div>

      </div>
    </section>


    {/* DASHBOARD PREVIEW */}
    <section className="pt-10 md:pt-22 pb-20 md:pb-32 px-5 md:px-20">

      <h2 className="text-2xl md:text-4xl font-semibold">
        Built For Action
      </h2>

      <p className="text-gray-400 mt-3 max-w-xl text-sm md:text-base">
        A live dashboard designed for teams that move fast.
      </p>

      <div className="mt-8 md:mt-12 
                      bg-[#0f0f0f] border border-gray-800 
                      rounded-2xl p-5 md:p-10 shadow-xl">
        <PreviewCharts />
      </div>

    </section>

    {/* FOOTER */}
    <footer className="py-8 md:py-10 text-center text-gray-500 text-sm">
      Task Force · Built for execution
    </footer>

  </main>
);


  
}
