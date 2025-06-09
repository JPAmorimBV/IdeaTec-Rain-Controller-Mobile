import { api } from './api';
import { Sensor, Leitura } from '../types';

export const sensorService = {
  // GET: /api/Sensor
  async getSensores(): Promise<Sensor[]> {
    try {
      const response = await api.get<Sensor[]>('/Sensor');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar sensores:', error);
      throw error;
    }
  },

  // GET: /api/Sensor/{id}
  async getSensorById(id: number): Promise<Sensor> {
    try {
      const response = await api.get<Sensor>(`/Sensor/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar sensor ${id}:`, error);
      throw error;
    }
  },

  // GET: /api/Sensor/PorZona/{zonaId}
  async getSensoresPorZona(zonaId: number): Promise<Sensor[]> {
    try {
      const response = await api.get<Sensor[]>(`/Sensor/PorZona/${zonaId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar sensores da zona ${zonaId}:`, error);
      throw error;
    }
  },

  // POST: /api/Sensor
  async createSensor(sensor: Omit<Sensor, 'id' | 'dataInstalacao'>): Promise<Sensor> {
    try {
      const response = await api.post<Sensor>('/Sensor', sensor);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar sensor:', error);
      throw error;
    }
  },

  // PUT: /api/Sensor/{id}
  async updateSensor(id: number, sensor: Sensor): Promise<void> {
    try {
      await api.put(`/Sensor/${id}`, sensor);
    } catch (error) {
      console.error(`Erro ao atualizar sensor ${id}:`, error);
      throw error;
    }
  },

  // DELETE: /api/Sensor/{id}
  async deleteSensor(id: number): Promise<void> {
    try {
      await api.delete(`/Sensor/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar sensor ${id}:`, error);
      throw error;
    }
  },
};
