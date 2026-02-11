
// export default function OrbitShowcase() {
//   return (
//     <section className="relative min-h-scree flex items-center justify-center overflow-hidden">
//       <div className="relative w-130 h-130">

//         {/* CENTER NODE */}
//         <div className="absolute inset-0 flex items-center justify-center z-20">
//           <div
//             className="w-16 h-16 rounded-full bg-teal-400 text-black font-bold
//                        flex items-center justify-center
//                        shadow-[0_0_30px_rgba(45,212,191,0.9)]"
//           >
//             TFM
//           </div>
//         </div>

//         {/* SVG ORBITS */}
//             <svg viewBox="0 0 520 520" className="absolute inset-0">
//             <defs>
//                 <path id="outerPath" d="M260 40 a220 220 0 1 1 -0.1 0" />
//                 <path id="middlePath" d="M260 80 a180 180 0 1 1 -0.1 0" />
//                 <path id="innerPath" d="M260 120 a140 140 0 1 1 -0.1 0" />
//                 {/* <path id="outerUnderlinePath" d="M260 30 a230 230 0 1 1 -0.1 0" /> */}

//             </defs>

//             {/* STATIC RINGS */}
//             <circle cx="260" cy="260" r="220" stroke="rgba(45,212,191,0.55)" strokeWidth="40" />
//             <circle cx="260" cy="260" r="240" fill="none" stroke="white" strokeWidth="1"/>
//             <circle cx="260" cy="260" r="180" stroke="rgba(192,132,252,0.45)" strokeWidth="40"/>
//             <circle cx="260" cy="260" r="200" fill="none" stroke="white"strokeWidth="1"/>
//             <circle cx="260" cy="260" r="140" stroke="rgba(56,189,248,0.65)" strokeWidth="40" />
//             <circle cx="260" cy="260" r="160" fill="none" stroke="white"strokeWidth="1"/>
//             <circle cx="260" cy="260" r="120" fill="none" stroke="white"strokeWidth="1"/>

//             {/* ========== OUTER : TASK ========== */}
//             <g>
//                 <animateTransform
//                 attributeName="transform"
//                 type="rotate"
//                 from="0 260 260"
//                 to="360 260 260"
//                 dur="18s"
//                 repeatCount="indefinite"
//                 />

//                 <line
//                 x1="260"
//                 y1="260"
//                 x2="285"
//                 y2="42"
//                 stroke="rgba(45,212,191)"
//                 strokeWidth={3}
//                 />
                
//                 <text
//                  fill="black" 
//                  fontSize="18" 
//                  letterSpacing="3"
//                  fontWeight="bold"
//                  >     
//                 <textPath href="#outerPath" startOffset="0%">
//                     TASK
//                 </textPath>
//                 </text>
//             </g>

//             {/* ========== MIDDLE : FORCE ========== */}
//             <g>
//                 <animateTransform
//                 attributeName="transform"
//                 type="rotate"
//                 from="0 260 260"
//                 to="360 260 260"
//                 dur="14s"
//                 repeatCount="indefinite"
//                 />

//                 <line
//                 x1="260"
//                 y1="260"
//                 x2="295"  //"435"
//                 y2="83"  //"295"
//                 stroke="rgba(192,132,252,2)"
//                 strokeWidth={3}
//                 />

//                 <text fill="black" fontSize="18" fontWeight="bold" letterSpacing="3">
//                 <textPath href="#middlePath" startOffset="0%">
//                     FORCE
//                 </textPath>
//                 </text>
//             </g>

//             {/* ========== INNER : MANAGEMENT ========== */}
//             <g>
//                 <animateTransform
//                 attributeName="transform"
//                 type="rotate"
//                 from="0 260 260"
//                 to="360 260 260"
//                 dur="10s"
//                 repeatCount="indefinite"
//                 />

//                 <line
//                 x1="260"
//                 y1="260"
//                 x2="335"
//                 y2="143"
//                 stroke="rgba(56,189,248,2)"
//                 strokeWidth={3}
//                 />

//                 <text fill="black" fontSize="18" fontWeight="bold" letterSpacing="3">
//                     <textPath href="#innerPath" startOffset="0%">
//                         MANAGEMENT
//                     </textPath>
//                 </text>
//             </g>
//             </svg>


//       </div>
//     </section>
//   );
// }




export default function OrbitShowcase() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Responsive container */}
      <div className="relative 
                      w-[320px] h-80 
                      sm:w-100 sm:h-100
                      md:w-130 md:h-130">

        {/* CENTER NODE */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div
            className="w-12 h-12 md:w-16 md:h-16 
                       rounded-full bg-teal-400 text-black font-bold
                       flex items-center justify-center
                       text-sm md:text-base
                       shadow-[0_0_30px_rgba(45,212,191,0.9)]"
          >
            TFM
          </div>
        </div>

        {/* SVG */}
        <svg viewBox="0 0 520 520" className="absolute inset-0 w-full h-full">
          <defs>
            <path id="outerPath" d="M260 40 a220 220 0 1 1 -0.1 0" />
            <path id="middlePath" d="M260 80 a180 180 0 1 1 -0.1 0" />
            <path id="innerPath" d="M260 120 a140 140 0 1 1 -0.1 0" />
          </defs>

          {/* STATIC RINGS */}
          {/* STATIC RINGS */}
    <circle cx="260" cy="260" r="220" stroke="rgba(16,185,129,0.55)" strokeWidth="40" />
    <circle cx="260" cy="260" r="240" fill="none" stroke="white" strokeWidth="1"/>

    <circle cx="260" cy="260" r="180" stroke="rgba(139,92,246,0.45)" strokeWidth="40"/>
    <circle cx="260" cy="260" r="200" fill="none" stroke="white" strokeWidth="1"/>

    <circle cx="260" cy="260" r="140" stroke="rgba(34,211,238,0.6)" strokeWidth="40" />
    <circle cx="260" cy="260" r="160" fill="none" stroke="white" strokeWidth="1"/>
    <circle cx="260" cy="260" r="120" fill="none" stroke="white" strokeWidth="1"/>


          {/* OUTER */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 260 260"
              to="360 260 260"
              dur="18s"
              repeatCount="indefinite"
            />
            <line x1="260" y1="260" x2="285" y2="42" stroke="#10B981" strokeWidth={3} />
            <text fill="#E5E7EB" fontSize="18" fontWeight="bold" letterSpacing="3">
              <textPath href="#outerPath">TASK</textPath>
            </text>
          </g>

          {/* MIDDLE */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 260 260"
              to="360 260 260"
              dur="14s"
              repeatCount="indefinite"
            />
            <line x1="260" y1="260" x2="295" y2="83" stroke="#8B5CF6" strokeWidth={3} />
            <text fill="#E5E7EB" fontSize="18" fontWeight="bold" letterSpacing="3">
              <textPath href="#middlePath">FORCE</textPath>
            </text>
          </g>

          {/* INNER */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 260 260"
              to="360 260 260"
              dur="10s"
              repeatCount="indefinite"
            />
            <line x1="260" y1="260" x2="320" y2="140" stroke="#22D3EE" strokeWidth={3} />
            <text fill="#E5E7EB" fontSize="18" fontWeight="bold" letterSpacing="3">
              <textPath href="#innerPath">MANAGER</textPath>
            </text>
          </g>

        </svg>
      </div>
    </section>
  );
}
