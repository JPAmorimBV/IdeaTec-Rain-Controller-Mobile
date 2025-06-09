import { Alert } from 'react-native';
import { API_CONFIG, ALERT_LEVELS, DATE_FORMATS, ERROR_MESSAGES } from './constants';
import { Leitura, Sensor, Alerta, ZonaDeRisco, OcorrenciaUsuario } from '../types';

// Formatação de data e hora
export const formatDate = (date: Date, format: keyof typeof DATE_FORMATS = 'DATE_TIME'): string => {
  const options: Intl.DateTimeFormatOptions = {};
  
  switch (format) {
    case 'DATE_TIME':
      return date.toLocaleString('pt-BR');
    case 'DATE':
      return date.toLocaleDateString('pt-BR');
    case 'TIME':
      return date.toLocaleTimeString('pt-BR');
    case 'SHORT_DATE_TIME':
      options.day = '2-digit';
      options.month = '2-digit';
      options.hour = '2-digit';
      options.minute = '2-digit';
      return date.toLocaleString('pt-BR', options);
    default:
      return date.toLocaleString('pt-BR');
  }
};

// Formatação de tempo relativo
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Agora mesmo';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min atrás`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h atrás`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d atrás`;
  }
  
  return formatDate(dateObj, 'DATE');
};

// Validação de nível de água
export const getWaterLevelStatus = (level: number): {
  status: 'normal' | 'preventive' | 'emergency';
  color: string;
  icon: string;
  message: string;
} => {
  if (level >= ALERT_LEVELS.EMERGENCY_THRESHOLD) {
    return {
      status: 'emergency',
      color: '#FF0000',
      icon: 'dangerous',
      message: 'EMERGÊNCIA - Nível crítico ultrapassado',
    };
  }
  
  if (level >= ALERT_LEVELS.PREVENTIVE_THRESHOLD) {
    return {
      status: 'preventive',
      color: '#FFA500',
      icon: 'warning',
      message: 'ALERTA - Nível preventivo atingido',
    };
  }
  
  return {
    status: 'normal',
    color: '#28A745',
    icon: 'check-circle',
    message: 'Normal - Nível dentro do esperado',
  };
};

// Validação de dados de zona 
export const validateZoneData = (data: {
  nome: string;
  endereco: string;
  nivelCritico: number;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.nome.trim()) {
    errors.push('Nome é obrigatório');
  }
  
  if (!data.endereco.trim()) {
    errors.push('Endereço é obrigatório');
  }
  
  if (data.nivelCritico < 1 || data.nivelCritico > 100) {
    errors.push('Nível crítico deve estar entre 1 e 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Formatação de porcentagem
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Formatação de números
export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Capitalização de texto
export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text: string): string => {
  return text.split(' ').map(word => capitalizeFirst(word)).join(' ');
};

// Validação de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Geração de ID único
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};


export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Tratamento de erros padronizado
export const handleError = (error: any): string => {
  if (error.response) {
    // Erro de resposta da API
    switch (error.response.status) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return error.response.data?.message || ERROR_MESSAGES.SERVER_ERROR;
    }
  } else if (error.request) {
    // Erro de rede
    return ERROR_MESSAGES.NETWORK_ERROR;
  } else if (error.code === 'ECONNABORTED') {
    // Timeout
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  } else {
    // Erro qualquer
    return error.message || 'Erro desconhecido';
  }
};

// Exibição de alertas 
export const showAlert = (
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export const showConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'Confirmar',
        onPress: onConfirm,
      },
    ]
  );
};

//Cálculo de estatísticas 
export const calculateStats = (readings: Leitura[]): {
  average: number;
  min: number;
  max: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdate: Date | null;
} => {
  if (readings.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      trend: 'stable',
      lastUpdate: null,
    };
  }

  const levels = readings.map(r => r.valor);
  const average = levels.reduce((sum, level) => sum + level, 0) / levels.length;
  const min = Math.min(...levels);
  const max = Math.max(...levels);
  
  // Calcular tendência baseada nas últimas 5 leituras
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (readings.length >= 2) {
    const recentReadings = readings
      .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
      .slice(0, 5);
    
    if (recentReadings.length >= 2) {
      const firstLevel = recentReadings[recentReadings.length - 1].valor;
      const lastLevel = recentReadings[0].valor;
      const difference = lastLevel - firstLevel;
      
      if (Math.abs(difference) > 5) {
        trend = difference > 0 ? 'up' : 'down';
      }
    }
  }

  const lastUpdate = readings.length > 0 
    ? readings.reduce((latest, reading) => {
        const readingDate = new Date(reading.dataHora);
        return readingDate > latest ? readingDate : latest;
      }, new Date(readings[0].dataHora))
    : null;

  return {
    average: Math.round(average * 10) / 10,
    min,
    max,
    trend,
    lastUpdate,
  };
};

export const analyzeSensorPerformance = (sensors: Sensor[]): {
  total: number;
  active: number;
  inactive: number;
  availability: number;
  lastMaintenanceNeeded: Sensor[];
} => {
  const total = sensors.length;
  const active = sensors.filter(s => s.ativo).length;
  const inactive = total - active;
  const availability = total > 0 ? (active / total) * 100 : 0;
  
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const lastMaintenanceNeeded = sensors.filter(sensor => 
    !sensor.ativo && 
    sensor.dataInstalacao && 
    new Date(sensor.dataInstalacao) < oneDayAgo
  );

  return {
    total,
    active,
    inactive,
    availability: Math.round(availability * 10) / 10,
    lastMaintenanceNeeded,
  };
};

export const analyzeAlertCriticality = (alerts: Alerta[]): {
  total: number;
  emergency: number;
  preventive: number;
  resolved: number;
  averageResolutionTime: number; 
  criticalRegions: string[];
} => {
  const total = alerts.length;
  const emergency = alerts.filter(a => a.nivel === 'Critico').length;
  const preventive = alerts.filter(a => a.nivel === 'Medio').length;
  const resolved = alerts.filter(a => !a.ativo).length;
  
  // Calcular tempo médio de resolução
  const resolvedAlerts = alerts.filter(a => !a.ativo);
  let averageResolutionTime = 0;
  
  if (resolvedAlerts.length > 0) {
    const totalResolutionTime = resolvedAlerts.reduce((sum, alert) => {
      const resolutionTime = Date.now() - new Date(alert.dataHora).getTime();
      return sum + resolutionTime;
    }, 0);
    
    averageResolutionTime = totalResolutionTime / resolvedAlerts.length / (1000 * 60 * 60); 
  }
  
  const activeEmergencyAlerts = alerts.filter(a => a.ativo && a.nivel === 'Critico');
  const regionAlertCount: Record<string, number> = {};
  
  activeEmergencyAlerts.forEach(alert => {
    if (alert.zonaDeRisco?.nome) {
      const region = alert.zonaDeRisco.nome;
      regionAlertCount[region] = (regionAlertCount[region] || 0) + 1;
    }
  });
  
  const criticalRegions = Object.entries(regionAlertCount)
    .filter(([_, count]) => count >= 2)
    .map(([region, _]) => region);

  return {
    total,
    emergency,
    preventive,
    resolved,
    averageResolutionTime: Math.round(averageResolutionTime * 10) / 10,
    criticalRegions,
  };
};

export const filterReadingsByRegion = (readings: Leitura[], region: string): Leitura[] => {
  if (!region.trim()) return readings;
  
  return readings.filter(reading => 
    reading.sensor?.zonaDeRisco?.nome?.toLowerCase().includes(region.toLowerCase())
  );
};

export const filterReadingsByDateRange = (
  readings: Leitura[], 
  startDate: Date, 
  endDate: Date
): Leitura[] => {
  return readings.filter(reading => {
    const readingDate = new Date(reading.dataHora);
    return readingDate >= startDate && readingDate <= endDate;
  });
};

export const sortReadingsByDate = (
  readings: Leitura[], 
  order: 'asc' | 'desc' = 'desc'
): Leitura[] => {
  return [...readings].sort((a, b) => {
    const dateA = new Date(a.dataHora).getTime();
    const dateB = new Date(b.dataHora).getTime();
    if (order === 'desc') {
      return dateB - dateA;
    }
    return dateA - dateB;
  });
};

export const sortReadingsByLevel = (
  readings: Leitura[], 
  order: 'asc' | 'desc' = 'desc'
): Leitura[] => {
  return [...readings].sort((a, b) => {
    if (order === 'desc') {
      return b.valor - a.valor;
    }
    return a.valor - b.valor;
  });
};

export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; 
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

// Validações de formulário
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || !value.trim()) {
    return `${fieldName} é obrigatório`;
  }
  return null;
};

export const validateMinLength = (
  value: string, 
  minLength: number, 
  fieldName: string
): string | null => {
  if (value.length < minLength) {
    return `${fieldName} deve ter pelo menos ${minLength} caracteres`;
  }
  return null;
};

export const validateMaxLength = (
  value: string, 
  maxLength: number, 
  fieldName: string
): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} deve ter no máximo ${maxLength} caracteres`;
  }
  return null;
};

export const validateNumericRange = (
  value: number, 
  min: number, 
  max: number, 
  fieldName: string
): string | null => {
  if (value < min || value > max) {
    return `${fieldName} deve estar entre ${min} e ${max}`;
  }
  return null;
};

class SimpleCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  size(): number {
    return this.cache.size;
  }
}

export const cache = new SimpleCache();

export const getStatusDisplay = (status: string): {
  text: string;
  color: string;
  backgroundColor: string;
} => {
  switch (status.toLowerCase()) {
    case 'ativo':
    case 'active':
      return {
        text: 'Ativo',
        color: '#28A745',
        backgroundColor: '#E6F7E6',
      };
    case 'inativo':
    case 'inactive':
      return {
        text: 'Inativo',
        color: '#DC3545',
        backgroundColor: '#FFE6E6',
      };
    case 'pendente':
      return {
        text: 'Pendente',
        color: '#FFC107',
        backgroundColor: '#FFF8E1',
      };
    case 'resolvida':
    case 'resolvido':
      return {
        text: 'Resolvido',
        color: '#28A745',
        backgroundColor: '#E6F7E6',
      };
    default:
      return {
        text: status,
        color: '#6C757D',
        backgroundColor: '#F8F9FA',
      };
  }
};

// Export padrão
export default {
  formatDate,
  formatRelativeTime,
  getWaterLevelStatus,
  validateZoneData,
  formatPercentage,
  formatNumber,
  capitalizeFirst,
  capitalizeWords,
  isValidEmail,
  generateId,
  debounce,
  throttle,
  handleError,
  showAlert,
  showConfirmAlert,
  calculateStats,
  analyzeSensorPerformance,
  analyzeAlertCriticality,
  filterReadingsByRegion,
  filterReadingsByDateRange,
  sortReadingsByDate,
  sortReadingsByLevel,
  calculateDistance,
  formatDistance,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumericRange,
  cache,
  getStatusDisplay,
};
