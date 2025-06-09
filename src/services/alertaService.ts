import { api } from './api';
import { Alerta, EnvioAlerta } from '../types';

export const alertaService = {
  // GET: /api/Alerta
  async getAlertas(): Promise<Alerta[]> {
    try {
      const response = await api.get<Alerta[]>('/Alerta');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      throw error;
    }
  },

  // GET: /api/Alerta/{id}
  async getAlertaById(id: number): Promise<Alerta> {
    try {
      const response = await api.get<Alerta>(`/Alerta/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar alerta ${id}:`, error);
      throw error;
    }
  },

  // POST: /api/Alerta
  async createAlerta(alerta: Omit<Alerta, 'id' | 'dataHora'>): Promise<Alerta> {
    try {
      const response = await api.post<Alerta>('/Alerta', alerta);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      throw error;
    }
  },

  // PUT: /api/Alerta/{id}
  async updateAlerta(id: number, alerta: Alerta): Promise<void> {
    try {
      await api.put(`/Alerta/${id}`, alerta);
    } catch (error) {
      console.error(`Erro ao atualizar alerta ${id}:`, error);
      throw error;
    }
  },

  // DELETE: /api/Alerta/{id}
  async deleteAlerta(id: number): Promise<void> {
    try {
      await api.delete(`/Alerta/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar alerta ${id}:`, error);
      throw error;
    }
  },

  // === ENVIO ALERTAS ===
  
  // GET: /api/EnvioAlerta
  async getEnvios(): Promise<EnvioAlerta[]> {
    try {
      const response = await api.get<EnvioAlerta[]>('/EnvioAlerta');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar envios:', error);
      throw error;
    }
  },

  // POST: /api/EnvioAlerta
  async createEnvio(envio: Omit<EnvioAlerta, 'id' | 'dataEnvio'>): Promise<EnvioAlerta> {
    try {
      const response = await api.post<EnvioAlerta>('/EnvioAlerta', envio);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar envio:', error);
      throw error;
    }
  },
};
