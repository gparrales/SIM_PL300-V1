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

  // Función para barajar opciones
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    // Mantenemos orden de preguntas, barajamos solo opciones
    const preparadas = preguntasData.map(p => ({
      ...p,
      opciones: shuffle(p.opciones)
    }));
    setPreguntas(preparadas);
  }, []);

  if (preguntas.length === 0) return <div className="p-10 text-center">Cargando...</div>;

  const preguntaActual = preguntas[indice];

  const manejarRespuesta = (opcion) => {
    if (respondido) return;
    setSeleccion(opcion);
    setRespondido(true);
    if (opcion === preguntaActual.correcta) setScore(score + 1);
  };

  const siguiente = () => {
    if (indice + 1 < preguntas.length) {
      setIndice(indice + 1);
      setRespondido(false);
      setSeleccion(null);
    } else {
      setTerminado(true);
    }
  };

  if (terminado) return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-xl rounded-xl text-center">
      <h2 className="text-2xl font-bold">¡Completado!</h2>
      <p className="text-lg mt-4">Puntaje: {score} de {preguntas.length}</p>
      <button onClick={() => window.location.reload()} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">Reiniciar</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-10">
        <div className="text-sm text-gray-500 mb-4">Pregunta {indice + 1} de {preguntas.length}</div>
        <h1 className="text-xl font-bold mb-6 text-blue-900">{preguntaActual.pregunta}</h1>
        
        <div className="space-y-3">
          {preguntaActual.opciones.map((op, i) => (
            <button
              key={i}
              onClick={() => manejarRespuesta(op)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all text-base ${
                respondido 
                  ? op === preguntaActual.correcta 
                    ? 'border-green-500 bg-green-50 text-green-700 font-bold' // Fuente verde si es correcta
                    : op === seleccion 
                      ? 'border-red-500 bg-red-50 text-red-700'              // Fuente roja si es incorrecta
                      : 'border-gray-100 text-gray-400'                     // Fuente gris para las no elegidas
                  : 'border-gray-200 hover:border-blue-400 text-gray-800'   // Fuente oscura por defecto
              }`}
            >
              <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
              {op}
            </button>
          ))}
        </div>

        {respondido && (
          <button onClick={siguiente} className="w-full mt-8 bg-black text-white py-3 rounded-lg font-bold">
            Siguiente
          </button>
        )}
      </div>
    </main>
  );
}