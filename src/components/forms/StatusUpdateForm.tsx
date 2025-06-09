import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '../../styles/colors';
import { OcorrenciaUsuario } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface StatusUpdateFormProps {
  ocorrencia: OcorrenciaUsuario | null;
  onSave: (statusData: { status: string; gravidade: string }) => Promise<void>;
  onCancel: () => void;
}

// ✅ CORREÇÃO: Tipo específico para ícones do MaterialIcons
type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

export default function StatusUpdateForm({ ocorrencia, onSave, onCancel }: StatusUpdateFormProps) {
  const [status, setStatus] = useState('Pendente');
  const [gravidade, setGravidade] = useState('Media');
  const [loading, setLoading] = useState(false);

  // ✅ CORREÇÃO: Definir ícones com tipos específicos
  const statusOptions = [
    { 
      label: 'Pendente', 
      value: 'Pendente', 
      icon: 'schedule' as MaterialIconName, 
      color: colors.warning 
    },
    { 
      label: 'Em Andamento', 
      value: 'EmAndamento', 
      icon: 'work' as MaterialIconName, 
      color: colors.info 
    },
    { 
      label: 'Resolvida', 
      value: 'Resolvida', 
      icon: 'check-circle' as MaterialIconName, 
      color: colors.success 
    },
  ];

  const gravidadeOptions = [
    { 
      label: 'Baixa', 
      value: 'Baixa', 
      icon: 'info' as MaterialIconName, 
      color: colors.info 
    },
    { 
      label: 'Média', 
      value: 'Media', 
      icon: 'warning' as MaterialIconName, 
      color: colors.warning 
    },
    { 
      label: 'Alta', 
      value: 'Alta', 
      icon: 'dangerous' as MaterialIconName, 
      color: colors.danger 
    },
  ];

  useEffect(() => {
    if (ocorrencia) {
      setStatus(ocorrencia.status);
      setGravidade(ocorrencia.gravidade);
    }
  }, [ocorrencia]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ status, gravidade });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Atualizar Status do Relato</Text>
        <Button
          title="Cancelar"
          variant="secondary"
          size="small"
          onPress={onCancel}
        />
      </View>

      <View style={styles.content}>
        {ocorrencia && (
          <Card style={styles.infoCard}>
            <View style={styles.relateInfo}>
              <Text style={styles.relateTitle}>{ocorrencia.titulo}</Text>
              <Text style={styles.relateUser}>Relator: {ocorrencia.nomeUsuario}</Text>
              <Text style={styles.relateDate}>
                {new Date(ocorrencia.dataOcorrencia).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </Card>
        )}

        <Card>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Status da Ocorrência</Text>
            
            <View style={styles.optionsContainer}>
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    status === option.value && styles.optionSelected,
                    { borderColor: option.color }
                  ]}
                  onPress={() => setStatus(option.value)}
                >
                  {/* ✅ LINHA 96 CORRIGIDA: Ícone tipado corretamente */}
                  <MaterialIcons 
                    name={option.icon} 
                    size={24} 
                    color={status === option.value ? option.color : colors.textSecondary} 
                  />
                  <Text style={[
                    styles.optionLabel,
                    status === option.value && { color: option.color, fontWeight: 'bold' }
                  ]}>
                    {option.label}
                  </Text>
                  {status === option.value && (
                    <MaterialIcons name="check" size={20} color={option.color} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Nível de Gravidade</Text>
            
            <View style={styles.optionsContainer}>
              {gravidadeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    gravidade === option.value && styles.optionSelected,
                    { borderColor: option.color }
                  ]}
                  onPress={() => setGravidade(option.value)}
                >
                  {/* ✅ LINHA 131 CORRIGIDA: Ícone tipado corretamente */}
                  <MaterialIcons 
                    name={option.icon} 
                    size={24} 
                    color={gravidade === option.value ? option.color : colors.textSecondary} 
                  />
                  <Text style={[
                    styles.optionLabel,
                    gravidade === option.value && { color: option.color, fontWeight: 'bold' }
                  ]}>
                    {option.label}
                  </Text>
                  {gravidade === option.value && (
                    <MaterialIcons name="check" size={20} color={option.color} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <Card style={styles.helpCard}>
          <View style={styles.helpHeader}>
            <MaterialIcons name="help" size={20} color={colors.info} />
            <Text style={styles.helpTitle}>Orientações de Status</Text>
          </View>
          <Text style={styles.helpText}>
            🟡 <Text style={styles.boldText}>Pendente:</Text> Aguardando verificação{'\n'}
            🔵 <Text style={styles.boldText}>Em Andamento:</Text> Equipes mobilizadas{'\n'}
            🟢 <Text style={styles.boldText}>Resolvida:</Text> Situação normalizada
          </Text>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button
          title="Atualizar Status"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={styles.saveButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  infoCard: {
    backgroundColor: colors.tertiary || '#F8F9FA',
  },
  relateInfo: {
    gap: 4,
  },
  relateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  relateUser: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  relateDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  formSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    gap: 12,
  },
  optionSelected: {
    backgroundColor: colors.tertiary || '#F0F8FF',
  },
  optionLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    flex: 1,
  },
  helpCard: {
    backgroundColor: colors.infoLight || '#E6F3FF',
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.info,
  },
  helpText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    width: '100%',
  },
});
