import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../styles/colors';
import { sensorService } from '../services/sensorService';
import { leituraService } from '../services/leituraService';
import { Sensor, Leitura } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';

export default function MonitoringScreen() {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  const loadData = async () => {
    try {
      const [sensoresData, leiturasData] = await Promise.all([
        sensorService.getSensores(),
        leituraService.getLeituras(),
      ]);
      
      setSensores(sensoresData);
      setLeituras(leiturasData);
    } catch (error) {
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível carregar os dados dos sensores.',
        [{ text: 'OK' }]
      );
      console.error('Erro ao carregar dados de monitoramento:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getStatusIcon = (ativo: boolean) => {
    return ativo ? 'sensors' : 'sensors-off';
  };

  const getStatusColor = (ativo: boolean) => {
    return ativo ? colors.success : colors.danger;
  };

  const getUltimaLeitura = (sensorId: number) => {
    return leituras
      .filter(l => l.sensorId === sensorId)
      .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())[0];
  };

  const renderSensorCard = (sensor: Sensor) => {
    const ultimaLeitura = getUltimaLeitura(sensor.id);
    
    return (
      <Card key={sensor.id} style={styles.sensorCard}>
        <TouchableOpacity
          onPress={() => setSelectedSensor(selectedSensor?.id === sensor.id ? null : sensor)}
        >
          <View style={styles.sensorHeader}>
            <View style={styles.sensorInfo}>
              <Text style={styles.sensorNome}>{sensor.nome}</Text>
              <Text style={styles.sensorDescricao}>{sensor.descricao}</Text>
              {sensor.zonaDeRisco && (
                <Text style={styles.zonaInfo}>📍 {sensor.zonaDeRisco.nome}</Text>
              )}
            </View>

            <View style={styles.statusContainer}>
              <MaterialIcons
                name={getStatusIcon(sensor.ativo)}
                size={24}
                color={getStatusColor(sensor.ativo)}
              />
              <Text style={[styles.statusText, { color: getStatusColor(sensor.ativo) }]}>
                {sensor.ativo ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>

          {ultimaLeitura && (
            <View style={styles.leituraContainer}>
              <Text style={styles.leituraLabel}>Última Leitura:</Text>
              <Text style={styles.leituraValor}>{ultimaLeitura.valor}mm</Text>
              <Text style={styles.leituraData}>
                {new Date(ultimaLeitura.dataHora).toLocaleString('pt-BR')}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {selectedSensor?.id === sensor.id && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Histórico de Leituras</Text>
            {leituras
              .filter(l => l.sensorId === sensor.id)
              .slice(0, 5)
              .map((leitura) => (
                <View key={leitura.id} style={styles.leituraItem}>
                  <Text style={styles.leituraItemValor}>{leitura.valor}mm</Text>
                  <Text style={styles.leituraItemData}>
                    {new Date(leitura.dataHora).toLocaleString('pt-BR')}
                  </Text>
                </View>
              ))}
          </View>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Carregando sensores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Monitoramento IoT</Text>
        <Text style={styles.subtitle}>
          {sensores.filter(s => s.ativo).length} de {sensores.length} sensor(es) online
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.textPrimary]}
            tintColor={colors.textPrimary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sensorsContainer}>
          {sensores.map(renderSensorCard)}
        </View>

        {sensores.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="sensors-off" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>Nenhum sensor encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Aguarde a instalação de sensores IoT nas regiões de monitoramento.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    padding: 20,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  sensorsContainer: {
    padding: 16,
    gap: 12,
  },
  sensorCard: {
    marginBottom: 0,
  },
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sensorInfo: {
    flex: 1,
    marginRight: 12,
  },
  sensorNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  sensorDescricao: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  zonaInfo: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  statusContainer: {
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  leituraContainer: {
    backgroundColor: colors.tertiary,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  leituraLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  leituraValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  leituraData: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  leituraItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leituraItemValor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  leituraItemData: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
