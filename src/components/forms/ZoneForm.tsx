import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { colors } from '../../styles/colors';
import { ZonaDeRisco } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface ZoneFormProps {
  zone?: ZonaDeRisco | null;
  onSave: (zoneData: Omit<ZonaDeRisco, 'id' | 'dataCriacao' | 'longitude'>) => Promise<void>;
  onCancel: () => void;
}

export default function ZoneForm({ zone, onSave, onCancel }: ZoneFormProps) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('SP');
  const [latitude, setLatitude] = useState('');
  const [nivelCritico, setNivelCritico] = useState('75');
  const [ativa, setAtiva] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (zone) {
      setNome(zone.nome);
      setDescricao(zone.descricao);
      setEndereco(zone.endereco);
      setCidade(zone.cidade);
      setEstado(zone.estado);
      setLatitude(zone.latitude.toString());
      setNivelCritico(zone.nivelCritico.toString());
      setAtiva(zone.ativa);
    }
  }, [zone]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }

    if (!cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }

    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = 'Latitude deve estar entre -90 e 90';
    }

    const nivel = parseFloat(nivelCritico);
    if (isNaN(nivel) || nivel < 1 || nivel > 100) {
      newErrors.nivelCritico = 'Nível crítico deve estar entre 1 e 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        nome: nome.trim(),
        descricao: descricao.trim(),
        endereco: endereco.trim(),
        cidade: cidade.trim(),
        estado: estado.trim(),
        latitude: parseFloat(latitude),
        nivelCritico: parseFloat(nivelCritico),
        ativa,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {zone ? 'Editar Zona' : 'Nova Zona de Risco'}
          </Text>
          <Button
            title="Cancelar"
            variant="secondary"
            size="small"
            onPress={onCancel}
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Card>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Informações da Zona</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Nome da Zona *</Text>
                <View style={[styles.inputContainer, errors.nome && styles.inputError]}>
                  <MaterialIcons name="location-on" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Ex: Centro Histórico SP"
                    placeholderTextColor={colors.textSecondary}
                    maxLength={100}
                  />
                </View>
                {errors.nome && (
                  <Text style={styles.errorText}>{errors.nome}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Descrição *</Text>
                <View style={[styles.inputContainer, errors.descricao && styles.inputError]}>
                  <MaterialIcons name="description" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles.textInput, styles.textAreaInput]}
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholder="Descreva as características desta zona..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={3}
                    maxLength={500}
                  />
                </View>
                {errors.descricao && (
                  <Text style={styles.errorText}>{errors.descricao}</Text>
                )}
              </View>
            </View>
          </Card>

          <Card>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Localização</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Endereço *</Text>
                <View style={[styles.inputContainer, errors.endereco && styles.inputError]}>
                  <MaterialIcons name="home" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={endereco}
                    onChangeText={setEndereco}
                    placeholder="Rua, número, bairro"
                    placeholderTextColor={colors.textSecondary}
                    maxLength={255}
                  />
                </View>
                {errors.endereco && (
                  <Text style={styles.errorText}>{errors.endereco}</Text>
                )}
              </View>

              <View style={styles.row}>
                <View style={[styles.fieldContainer, styles.flexField]}>
                  <Text style={styles.fieldLabel}>Cidade *</Text>
                  <View style={[styles.inputContainer, errors.cidade && styles.inputError]}>
                    <MaterialIcons name="location-city" size={20} color={colors.textSecondary} />
                    <TextInput
                      style={styles.textInput}
                      value={cidade}
                      onChangeText={setCidade}
                      placeholder="São Paulo"
                      placeholderTextColor={colors.textSecondary}
                      maxLength={100}
                    />
                  </View>
                  {errors.cidade && (
                    <Text style={styles.errorText}>{errors.cidade}</Text>
                  )}
                </View>

                <View style={[styles.fieldContainer, styles.smallField]}>
                  <Text style={styles.fieldLabel}>Estado *</Text>
                  <View style={[styles.inputContainer, errors.estado && styles.inputError]}>
                    <TextInput
                      style={styles.textInput}
                      value={estado}
                      onChangeText={setEstado}
                      placeholder="SP"
                      placeholderTextColor={colors.textSecondary}
                      maxLength={2}
                      autoCapitalize="characters"
                    />
                  </View>
                  {errors.estado && (
                    <Text style={styles.errorText}>{errors.estado}</Text>
                  )}
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Latitude *</Text>
                <View style={[styles.inputContainer, errors.latitude && styles.inputError]}>
                  <MaterialIcons name="my-location" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={latitude}
                    onChangeText={setLatitude}
                    placeholder="-23.5505 (São Paulo)"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
                {errors.latitude && (
                  <Text style={styles.errorText}>{errors.latitude}</Text>
                )}
                <Text style={styles.helpText}>
                  💡 A longitude será calculada automaticamente com base na região
                </Text>
              </View>
            </View>
          </Card>

          <Card>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Configurações de Alerta</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Nível Crítico (%) *</Text>
                <View style={[styles.inputContainer, errors.nivelCritico && styles.inputError]}>
                  <MaterialIcons name="warning" size={20} color={colors.warning} />
                  <TextInput
                    style={styles.textInput}
                    value={nivelCritico}
                    onChangeText={setNivelCritico}
                    placeholder="75"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="decimal-pad"
                    maxLength={5}
                  />
                  <Text style={styles.percentSymbol}>%</Text>
                </View>
                {errors.nivelCritico && (
                  <Text style={styles.errorText}>{errors.nivelCritico}</Text>
                )}
                <Text style={styles.helpText}>
                  Nível de água que dispara alertas de eventos extremos (recomendado: 70-85%)
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialIcons name="info" size={20} color={colors.info} />
              <Text style={styles.infoTitle}>Sistema IdeaTec - Eventos Extremos</Text>
            </View>
            <Text style={styles.infoText}>
              🟡 <Text style={styles.boldText}>Preventivo:</Text> 70% do nível crítico{'\n'}
              🟠 <Text style={styles.boldText}>Alto:</Text> 85% do nível crítico{'\n'}
              🔴 <Text style={styles.boldText}>Emergência:</Text> 90% do nível crítico{'\n'}
              📍 <Text style={styles.boldText}>Localização:</Text> Longitude calculada automaticamente
            </Text>
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={zone ? 'Atualizar Zona' : 'Criar Zona'}
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.saveButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ✅ Estilos mantidos iguais (mesmos da versão anterior)
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formSection: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  fieldContainer: {
    gap: 8,
  },
  flexField: {
    flex: 2,
  },
  smallField: {
    flex: 0.8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.background,
    gap: 8,
  },
  inputError: {
    borderColor: colors.danger,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 20,
  },
  textAreaInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  percentSymbol: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  infoCard: {
    marginTop: 16,
    backgroundColor: colors.infoLight || '#E6F3FF',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.info,
  },
  infoText: {
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
