interface Props {
  titulo: string;
  descripcion: string;
  accion?: { label: string; onClick: () => void };
}

// EstadoVacio.tsx
export const EstadoVacio = ({ titulo, descripcion, accion }: Props) => {
  return (
    // 1. Agregamos flex-col, items-center y text-center para centrar todo el bloque
    <div className="mt-12 flex flex-col items-center justify-center text-center px-4">
      {/* 2. El icono ahora se mantendrá perfectamente en el medio */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <svg
          className="h-14 w-14"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m23.956 16.795-8.63-7.452c-.416-.36-1.007-.444-1.504-.215-.499.228-.822.73-.822 1.279v11.547l3.875-3.519 2.786 5.492 1.783-.904-2.76-5.441 5.271-.788zm-2.956-16.795h-18c-1.654 0-3 1.346-3 3v15h11v-7.592c0-1.33.781-2.546 1.991-3.098 1.203-.555 2.636-.351 3.645.522l7.365 6.359v-11.191c0-1.654-1.346-3-3-3zm-15 14h-2v-10h2z"
          />
        </svg>
      </div>

      {/* 3. Textos informativos */}
      <h3 className="text-lg font-semibold text-slate-900">{titulo}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{descripcion}</p>

      {/* 4. Tu botón estilizado */}
      {accion && (
        <button
          type="button"
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50/50 px-3 py-1.5 text-sm font-medium text-indigo-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95"
          onClick={accion.onClick}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          {accion.label}
        </button>
      )}
    </div>
  );
};

// export function EstadoVacio({ titulo, descripcion, accion }: Props) {
//   return (
//     <div className="py-16 text-center">
//       <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:scale-105 transition-transform duration-200">
//         <svg
//           className="h-7 w-7"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth="1.75"
//           stroke="currentColor"
//         >
//           {/* Silueta del paciente/usuario */}
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
//           />
//           {/* Lupa de búsqueda */}
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M21 21l-3.35-3.35M19 11a4 4 0 11-8 0 4 4 0 018 0z"
//           />
//         </svg>
//       </div>

//       <h3 className="font-semibold text-slate-700">{titulo}</h3>

//       {descripcion && (
//         <p className="mt-1 text-sm text-slate-500">{descripcion}</p>
//       )}

//       {accion && (
//         <button
//           type="button"
//           className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50/50 px-3 py-1.5 text-sm font-medium text-indigo-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95"
//           onClick={accion.onClick}
//         >
//           {/* Icono sutil de reciclaje/limpieza (opcional, aporta mucha calidad visual) */}
//           <svg
//             className="h-4 w-4"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="2"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
//             />
//           </svg>

//           {accion.label}
//         </button>
//       )}
//     </div>
//   );
// }
