// import React from "react";

// export default function OrbitAnimation() {
//   return (
//     <div className="relative w-[320px] h-320 flex items-center justify-center">

//       {/* Center Node */}
//       <div className="absolute z-10 w-14 h-14 rounded-full bg-teal-400 
//                       flex items-center justify-center text-black font-bold shadow-lg">
//         TF
//       </div>

//       {/* Orbit 1 */}
//       <div className="absolute inset-0 rounded-full border border-white/10 animate-orbit">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 
//                         w-3 h-3 rounded-full bg-teal-400 
//                         shadow-[0_0_12px_rgba(45,212,191,0.9)]" />
//       </div>

//       {/* Orbit 2 */}
//       <div className="absolute inset-6 rounded-full border border-white/10 animate-orbit-slow">
//         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 
//                         w-2.5 h-2.5 rounded-full bg-purple-400 
//                         shadow-[0_0_12px_rgba(192,132,252,0.9)]" />
//       </div>

//     </div>
//   );
// }

import React from "react";

export default function OrbitAnimation() {
  return (
    // CAMERA
    <div className="relative w-[320px] h-80 flex items-center justify-center perspective-[1000px]">

      {/* TILT ONLY */}
      <div className="relative w-full h-full rotate-x-12 rotate-z-45">

        {/* CENTER NODE */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-14 h-14 rounded-full bg-teal-400 
                          flex items-center justify-center text-black font-bold shadow-lg">
            TF
          </div>
        </div>

        {/* ORBIT 1 — PURE CIRCLE */}
        <div className="absolute inset-1 rounded-full border border-white/30 a">
          <div className="absolute top-1 left-1/2 -translate-x-1/2
                          w-4 h-4 rounded-full bg-teal-400 
                          shadow-[0_0_12px_rgba(45,212,191,0.9)]" />
        </div>

        {/* ORBIT 2 — PURE CIRCLE */}
        <div className="absolute inset-4 rounded-full border border-white/30">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2
                          w-2.5 h-2.5 rounded-full bg-purple-400 
                          shadow-[0_0_12px_rgba(192,132,252,0.9)]" />
        </div>

        {/* ORBIT 2 — PURE CIRCLE */}
        <div className="absolute inset-8 rounded-full border border-white/30">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2
                          w-2.5 h-2.5 rounded-full bg-purple-400 
                          shadow-[0_0_12px_rgba(192,132,252,0.9)]" />
        </div>

      </div>
    </div>
  );
}
