'use client';
import { useState, useEffect } from 'react';
import preguntasData from '../data/preguntas1.json';

export default function Quiz() {
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [score, setScore] = useState(0);
  const [respondido, setRespondido] = useState(false);
  const [seleccion, setSeleccion] = useState(null);
  const [terminado, setTerminado] = useState(false);

  // Cargamos los datos una sola vez al inicio
  useEffect(() => {
    if (preguntasData && preguntasData.length > 0) {
      setPreguntas(preguntasData);
    }
  }, []);

  if (preguntas.length === 0) return <div className="p-20 text-center">Cargando preguntas...</div>;

  const preguntaActual = preguntas[indice];

  const manejarRespuesta = (opcion) => {
    if (respondido) return;
    
    setSeleccion(opcion);
    setRespondido(true);

    // Normalización para que el score suba aunque haya espacios o mayúsculas diferentes
    const limpiaRespuesta = opcion.toString().trim().toLowerCase();
    const limpiaCorrecta = preguntaActual.correcta.toString().trim().toLowerCase();

    if (limpiaRespuesta === limpiaCorrecta) {
      setScore(prev => prev + 1);
    }
  };

  const siguiente = () => {
    const proximoIndice = indice + 1;
    if (proximoIndice < preguntas.length) {
      setIndice(proximoIndice);
      setRespondido(false);
      setSeleccion(null);
    } else {
      setTerminado(true);
    }
  };

  if (terminado) return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white shadow-2xl rounded-3xl text-center border-t-8 border-blue-500">
      <h2 className="text-3xl font-black text-slate-800">¡Simulacro Terminado!</h2>
      <div className="my-8 p-6 bg-slate-50 rounded-2xl">
        <p className="text-6xl font-black text-blue-600">{score}</p>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Aciertos de {preguntas.length}</p>
      </div>
      <button 
        onClick={() => window.location.reload()} 
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95"
      >
        Reiniciar Simulacro
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-100 p-4 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-[2rem] shadow-2xl">
        
        {/* Cabecera dinámica: Aquí se corrige el "Pregunta X de Y" */}
        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Tu Progreso</span>
            <span className="text-2xl font-black text-slate-800">
              Pregunta {indice + 1} <span className="text-slate-300 font-light">/ {preguntas.length}</span>
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Aciertos</span>
            <span className="text-2xl font-black text-slate-800">{score}</span>
          </div>
        </div>

        {/* Barra de progreso visual que se mueve al dar 'Siguiente' */}
        <div className="w-full h-2 bg-slate-100 rounded-full mb-10 overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-700 ease-out" 
            style={{ width: `${((indice + 1) / preguntas.length) * 100}%` }}
          ></div>
        </div>

        <h1 className="text-xl font-bold text-slate-800 mb-8 leading-snug">
          {preguntaActual.pregunta}
        </h1>
        
        <div className="grid gap-3">
          {preguntaActual.opciones.map((op, i) => {
            // Lógica de colores por cada botón según la respuesta
            let colorClase = "border-slate-100 bg-white text-slate-700 hover:border-blue-300 shadow-sm";
            if (respondido) {
              if (op === preguntaActual.correcta) {
                colorClase = "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-md shadow-emerald-100";
              } else if (op === seleccion) {
                colorClase = "border-rose-500 bg-rose-50 text-rose-700 shadow-md shadow-rose-100";
              } else {
                colorClase = "border-slate-50 opacity-40 text-slate-400";
              }
            }

            return (
              <button
                key={`${indice}-${i}`} // Esta key es CLAVE para que los botones se refresquen
                onClick={() => manejarRespuesta(op)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${colorClase}`}
              >
                <span className="font-black mr-3 text-slate-300">{String.fromCharCode(65 + i)}</span>
                {op}
              </button>
            );
          })}
        </div>

        {/* Botón Siguiente que aparece tras responder */}
        {respondido && (
          <button 
            onClick={siguiente} 
            className="w-full mt-10 bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
          >
            {indice + 1 === preguntas.length ? "Ver Resultados Finales" : "Siguiente Pregunta"}
          </button>
        )}
      </div>

      <p className="mt-6 text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
        PL-300 Exam Prep Simulator
      </p>
    </main>
  );
}