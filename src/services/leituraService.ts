import { api } from './api';
import { Leitura } from '../types';

export const leituraService = {
  // GET: /api/Leitura
  async getLeituras(): Promise<Leitura[]> {
    try {
      const response = await api.get<Leitura[]>('/Leitura');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar leituras:', error);
      throw error;
    }
  },

  // GET: /api/Leitura/{id}
  async getLeituraById(id: number): Promise<Leitura> {
    try {
      const response = await api.get<Leitura>(`/Leitura/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar leitura ${id}:`, error);
      throw error;
    }
  },

  // GET: /api/Leitura/sensor/{sensorId}
  async getLeiturasPorSensor(sensorId: number): Promise<Leitura[]> {
    try {
      const response = await api.get<Leitura[]>(`/Leitura/sensor/${sensorId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar leituras do sensor ${sensorId}:`, error);
      throw error;
    }
  },

  // POST: /api/Leitura
  async createLeitura(leitura: Omit<Leitura, 'id' | 'dataHora'>): Promise<Leitura> {
    try {
      const response = await api.post<Leitura>('/Leitura', leitura);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar leitura:', error);
      throw error;
    }
  },

  // DELETE: /api/Leitura/{id}
  async deleteLeitura(id: number): Promise<void> {
    try {
      await api.delete(`/Leitura/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar leitura ${id}:`, error);
      throw error;
    }
  },
};
