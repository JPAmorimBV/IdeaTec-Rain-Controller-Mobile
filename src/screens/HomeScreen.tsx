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
import { zonaRiscoService } from '../services/zonaRiscoService';
import { sensorService } from '../services/sensorService';
import { alertaService } from '../services/alertaService';
import { ocorrenciaService } from '../services/ocorrenciaService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';


type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

interface DashboardStats {
  totalZonas: number;
  zonasAtivas: number;
  totalSensores: number;
  sensoresAtivos: number;
  alertasAtivos: number;
  alertasCriticos: number;
  totalOcorrencias: number;
  ocorrenciasPendentes: number;
  ultimaAtualizacao: Date;
}


interface SystemStatus {
  status: string;
  color: string;
  icon: MaterialIconName;
}

export default function HomeScreen() {
  const [stats, setStats] = useState<DashboardStats>({
    totalZonas: 0,
    zonasAtivas: 0,
    totalSensores: 0,
    sensoresAtivos: 0,
    alertasAtivos: 0,
    alertasCriticos: 0,
    totalOcorrencias: 0,
    ocorrenciasPendentes: 0,
    ultimaAtualizacao: new Date(),
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [zonas, sensores, alertas, ocorrencias] = await Promise.all([
        zonaRiscoService.getZonas(),
        sensorService.getSensores(),
        alertaService.getAlertas(),
        ocorrenciaService.getOcorrencias(),
      ]);

      setStats({
        totalZonas: zonas.length,
        zonasAtivas: zonas.filter(z => z.ativa).length,
        totalSensores: sensores.length,
        sensoresAtivos: sensores.filter(s => s.ativo).length,
        alertasAtivos: alertas.filter(a => a.ativo).length,
        alertasCriticos: alertas.filter(a => a.ativo && a.nivel === 'Critico').length,
        totalOcorrencias: ocorrencias.length,
        ocorrenciasPendentes: ocorrencias.filter(o => o.status === 'Pendente').length,
        ultimaAtualizacao: new Date(),
      });
    } catch (error) {
      Alert.alert(
        'Erro de Conexão', 
        'Não foi possível carregar os dados. Verifique sua conexão com a API.',
        [{ text: 'OK' }]
      );
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  
  const getSystemStatus = (): SystemStatus => {
    if (stats.alertasCriticos > 0) {
      return {
        status: 'EMERGÊNCIA ATIVA',
        color: colors.danger,
        icon: 'dangerous' as MaterialIconName,
      };
    }
    if (stats.alertasAtivos > 0) {
      return {
        status: 'ALERTAS ATIVOS',
        color: colors.warning,
        icon: 'warning' as MaterialIconName,
      };
    }
    return {
      status: 'SISTEMA NORMAL',
      color: colors.success,
      icon: 'check-circle' as MaterialIconName,
    };
  };

  const systemStatus = getSystemStatus();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Carregando dados da API...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={[colors.textPrimary]}
          tintColor={colors.textPrimary}
        />
      }
    >
      {/* Header da Empresa */}
      <View style={styles.header}>
        <MaterialIcons name="water-drop" size={40} color={colors.textPrimary} />
        <Text style={styles.title}>IdeaTec Tecnologia</Text>
        <Text style={styles.subtitle}>Monitoramento de Enchentes</Text>
        
        <View style={[styles.statusBadge, { backgroundColor: systemStatus.color }]}>
          <MaterialIcons name={systemStatus.icon} size={20} color={colors.primary} />
          <Text style={styles.statusText}>{systemStatus.status}</Text>
        </View>
      </View>

      {/* Cards de Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <MaterialIcons name="location-on" size={32} color={colors.textPrimary} />
            <Text style={styles.statNumber}>{stats.totalZonas}</Text>
            <Text style={styles.statLabel}>Zonas Cadastradas</Text>
            <Text style={styles.statSubLabel}>{stats.zonasAtivas} ativas</Text>
          </Card>

          <Card style={styles.statCard}>
            <MaterialIcons name="sensors" size={32} color={colors.info} />
            <Text style={[styles.statNumber, { color: colors.info }]}>
              {stats.totalSensores}
            </Text>
            <Text style={styles.statLabel}>Sensores</Text>
            <Text style={styles.statSubLabel}>{stats.sensoresAtivos} ativos</Text>
          </Card>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <MaterialIcons 
              name="warning" 
              size={32} 
              color={stats.alertasAtivos > 0 ? colors.warning : colors.textSecondary} 
            />
            <Text style={[
              styles.statNumber, 
              { color: stats.alertasAtivos > 0 ? colors.warning : colors.textPrimary }
            ]}>
              {stats.alertasAtivos}
            </Text>
            <Text style={styles.statLabel}>Alertas Ativos</Text>
            <Text style={[styles.statSubLabel, 
              { color: stats.alertasCriticos > 0 ? colors.danger : colors.textSecondary }
            ]}>
              {stats.alertasCriticos} críticos
            </Text>
          </Card>

          <Card style={styles.statCard}>
            <MaterialIcons name="report" size={32} color={colors.secondary} />
            <Text style={[styles.statNumber, { color: colors.secondary }]}>
              {stats.totalOcorrencias}
            </Text>
            <Text style={styles.statLabel}>Relatos</Text>
            <Text style={styles.statSubLabel}>{stats.ocorrenciasPendentes} pendentes</Text>
          </Card>
        </View>
      </View>

      {/* Seção de Informações */}
      <Card style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Sistema de Monitoramento</Text>
        <View style={styles.infoContent}>
          <View style={styles.infoRow}>
            <MaterialIcons name="api" size={20} color={colors.success} />
            <Text style={styles.infoText}>Conectado à API .NET</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="storage" size={20} color={colors.info} />
            <Text style={styles.infoText}>Dados persistidos em SQL Server</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="update" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              Última atualização: {stats.ultimaAtualizacao.toLocaleTimeString('pt-BR')}
            </Text>
          </View>
        </View>
      </Card>

      {/* Seção de Alertas */}
      <Card style={styles.alertSection}>
        <Text style={styles.sectionTitle}>Níveis de Alerta</Text>
        <View style={styles.alertLevels}>
          <View style={styles.alertLevel}>
            <View style={[styles.alertDot, { backgroundColor: colors.info }]} />
            <Text style={styles.alertText}>🔵 Baixo: Situação normal</Text>
          </View>
          <View style={styles.alertLevel}>
            <View style={[styles.alertDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.alertText}>🟡 Médio: Atenção necessária</Text>
          </View>
          <View style={styles.alertLevel}>
            <View style={[styles.alertDot, { backgroundColor: '#FF8C00' }]} />
            <Text style={styles.alertText}>🟠 Alto: Risco elevado</Text>
          </View>
          <View style={styles.alertLevel}>
            <View style={[styles.alertDot, { backgroundColor: colors.danger }]} />
            <Text style={styles.alertText}>🔴 Crítico: Emergência</Text>
          </View>
        </View>
      </Card>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Desenvolvido para Global Solution 2025/1
        </Text>
        <Text style={styles.footerSubText}>
          MOBILE APPLICATION DEVELOPMENT
        </Text>
      </View>
    </ScrollView>
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
    padding: 24,
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  statSubLabel: {
    fontSize: 10,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 2,
  },
  infoSection: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  infoContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  alertSection: {
    margin: 16,
    padding: 16,
  },
  alertLevels: {
    gap: 12,
  },
  alertLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alertDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  alertText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footerSubText: {
    fontSize: 10,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
});
