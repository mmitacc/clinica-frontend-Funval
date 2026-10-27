import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
}

// 5 minutos en milisegundos (5 * 60 * 1000)
const TIEMPO_INACTIVIDAD = 300000;

export default function MonitorInactividad({ children }: Props) {
  const { token, logout } = useAuthStore();
  const temporizadorRef = useRef<NodeJS.Timeout | null>(null);

  const reiniciarTemporizador = () => {
    // Si el temporizador ya estaba corriendo, lo limpiamos
    if (temporizadorRef.current) {
      clearTimeout(temporizadorRef.current);
    }

    // Si el usuario no está logueado, no activamos el monitor
    if (!token) return;

    // Iniciamos la cuenta regresiva de 5 minutos
    temporizadorRef.current = setTimeout(() => {
      logout();
      toast.warning(
        "Sesión cerrada automáticamente por 5 minutos de inactividad en el Sistema de la Clìnica.",
        {
          duration: 8000,
        },
      );
    }, TIEMPO_INACTIVIDAD);
  };

  useEffect(() => {
    // Si no hay sesión activa, no agregamos los listeners
    if (!token) {
      if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
      return;
    }

    // Eventos del navegador que se consideran "actividad"
    const eventos = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Registramos los listeners en el navegador
    eventos.forEach((evento) => {
      window.addEventListener(evento, reiniciarTemporizador);
    });

    // Inicializamos el primer temporizador al cargar el componente
    reiniciarTemporizador();

    // Limpieza de eventos y temporizadores cuando el componente se desmonte
    return () => {
      eventos.forEach((evento) => {
        window.removeEventListener(evento, reiniciarTemporizador);
      });
      if (temporizadorRef.current) {
        clearTimeout(temporizadorRef.current);
      }
    };
  }, [token]); // Se vuelve a ejecutar si el estado del token cambia

  return <>{children}</>;
}
