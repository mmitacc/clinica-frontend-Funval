import axios from "axios";

export function extraerMensajeError(err: unknown): string {
  // 1. Validar si es un error específico de Axios (Tiene respuesta del servidor)
  if (axios.isAxiosError(err)) {
    // Busca el mensaje que tu backend suele enviar en el JSON de respuesta
    // Ajusta 'err.response?.data?.message' según cómo estructure los errores tu API
    return (
      err.response?.data?.message ||
      err.response?.data?.error ||
      `Error del servidor (${err.response?.status})`
    );
  }
  // 2. Validar si es un error nativo de JavaScript/TypeScript
  if (err instanceof Error) {
    return err.message;
  }
  // 3. Fallback para casos extraños
  return "Error inesperado";
}
