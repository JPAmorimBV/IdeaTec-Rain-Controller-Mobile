export const API_CONFIG = {
  // URL com IP e porta corretos
  BASE_URL: 'http://192.168.0.48:5055/api',
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
} as const;

export const ALERT_LEVELS = {
  PREVENTIVE_THRESHOLD: 70,
  EMERGENCY_THRESHOLD: 90,
} as const;

export const DATE_FORMATS = {
  DATE_TIME: 'DATE_TIME',
  DATE: 'DATE',
  TIME: 'TIME',
  SHORT_DATE_TIME: 'SHORT_DATE_TIME',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  TIMEOUT_ERROR: 'Tempo limite esgotado. Tente novamente.',
  SERVER_ERROR: 'Erro interno do servidor.',
  VALIDATION_ERROR: 'Dados inválidos fornecidos.',
  UNAUTHORIZED: 'Acesso não autorizado.',
  FORBIDDEN: 'Acesso proibido.',
  NOT_FOUND: 'Recurso não encontrado.',
} as const;

export const APP_CONFIG = {
  NAME: 'IdeaTec Monitoramento',
  VERSION: '1.0.0',
  COMPANY: 'IdeaTec Tecnologia',
  THEME: 'Sistema de Alerta para Eventos Extremos',
  PROJECT: 'Global Solution 2025/1 - Eventos Extremos',
} as const;
