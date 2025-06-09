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
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '../../styles/colors';
import { OcorrenciaUsuario } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface OcorrenciaFormProps {
  ocorrencia?: OcorrenciaUsuario | null;
  onSave: (ocorrenciaData: Omit<OcorrenciaUsuario, 'id' | 'latitude' | 'longitude'>) => Promise<void>;
  onCancel: () => void;
}

export default function OcorrenciaForm({ ocorrencia, onSave, onCancel }: OcorrenciaFormProps) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [telefoneUsuario, setTelefoneUsuario] = useState('');
  const [gravidade, setGravidade] = useState('Media');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const gravidadeOptions = [
    { label: 'Baixa - Situação controlada', value: 'Baixa' },
    { label: 'Média - Atenção necessária', value: 'Media' },
    { label: 'Alta - Situação crítica', value: 'Alta' },
  ];

  useEffect(() => {
    if (ocorrencia) {
      setTitulo(ocorrencia.titulo);
      setDescricao(ocorrencia.descricao);
      setNomeUsuario(ocorrencia.nomeUsuario);
      setEmailUsuario(ocorrencia.emailUsuario);
      setTelefoneUsuario(ocorrencia.telefoneUsuario);
      setGravidade(ocorrencia.gravidade);
    }
  }, [ocorrencia]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!nomeUsuario.trim()) {
      newErrors.nomeUsuario = 'Nome é obrigatório';
    }

    if (!emailUsuario.trim()) {
      newErrors.emailUsuario = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(emailUsuario)) {
      newErrors.emailUsuario = 'E-mail inválido';
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
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        dataOcorrencia: new Date().toISOString(),
        nomeUsuario: nomeUsuario.trim(),
        emailUsuario: emailUsuario.trim(),
        telefoneUsuario: telefoneUsuario.trim(),
        tipoOcorrencia: 'Evento Extremo', 
        status: 'Pendente',
        gravidade,
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
          <Text style={styles.title}>Novo Relato de Evento Extremo</Text>
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
              <Text style={styles.sectionTitle}>Informações da Ocorrência</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Título do Relato *</Text>
                <View style={[styles.inputContainer, errors.titulo && styles.inputError]}>
                  <MaterialIcons name="title" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={titulo}
                    onChangeText={setTitulo}
                    placeholder="Ex: Alagamento na Rua A"
                    placeholderTextColor={colors.textSecondary}
                    maxLength={200}
                  />
                </View>
                {errors.titulo && (
                  <Text style={styles.errorText}>{errors.titulo}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Descrição Detalhada *</Text>
                <View style={[styles.inputContainer, errors.descricao && styles.inputError]}>
                  <MaterialIcons name="description" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles.textInput, styles.textAreaInput]}
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholder="Descreva detalhadamente a situação observada..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={4}
                    maxLength={1000}
                  />
                </View>
                {errors.descricao && (
                  <Text style={styles.errorText}>{errors.descricao}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Gravidade da Situação *</Text>
                <Text style={styles.helpText}>
                  Avalie o nível de urgência da situação observada
                </Text>
                
                <View style={styles.gravidadeContainer}>
                  {gravidadeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.gravidadeOption,
                        gravidade === option.value && styles.gravidadeOptionSelected
                      ]}
                      onPress={() => setGravidade(option.value)}
                    >
                      <View style={[
                        styles.radioCircle,
                        gravidade === option.value && styles.radioCircleSelected
                      ]}>
                        {gravidade === option.value && (
                          <View style={styles.radioDot} />
                        )}
                      </View>
                      <Text style={[
                        styles.gravidadeLabel,
                        gravidade === option.value && styles.gravidadeLabelSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Card>

          <Card>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Dados do Relator</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Nome Completo *</Text>
                <View style={[styles.inputContainer, errors.nomeUsuario && styles.inputError]}>
                  <MaterialIcons name="person" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={nomeUsuario}
                    onChangeText={setNomeUsuario}
                    placeholder="Seu nome completo"
                    placeholderTextColor={colors.textSecondary}
                    maxLength={100}
                  />
                </View>
                {errors.nomeUsuario && (
                  <Text style={styles.errorText}>{errors.nomeUsuario}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>E-mail *</Text>
                <View style={[styles.inputContainer, errors.emailUsuario && styles.inputError]}>
                  <MaterialIcons name="email" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={emailUsuario}
                    onChangeText={setEmailUsuario}
                    placeholder="seu@email.com"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    maxLength={150}
                  />
                </View>
                {errors.emailUsuario && (
                  <Text style={styles.errorText}>{errors.emailUsuario}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Telefone (Opcional)</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="phone" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={telefoneUsuario}
                    onChangeText={setTelefoneUsuario}
                    placeholder="(11) 99999-9999"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="phone-pad"
                    maxLength={20}
                  />
                </View>
              </View>
            </View>
          </Card>

          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialIcons name="info" size={20} color={colors.info} />
              <Text style={styles.infoTitle}>Sistema IdeaTec - Eventos Extremos</Text>
            </View>
            <Text style={styles.infoText}>
              🌍 <Text style={styles.boldText}>Localização:</Text> Detectada automaticamente pelo sistema{'\n'}
              📱 <Text style={styles.boldText}>Categoria:</Text> Classificado como evento extremo{'\n'}
              🎯 <Text style={styles.boldText}>Urgência:</Text> Processado conforme gravidade selecionada{'\n'}
              ⚡ <Text style={styles.boldText}>Resposta:</Text> Equipes notificadas automaticamente
            </Text>
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Enviar Relato"
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
    height: 100,
    textAlignVertical: 'top',
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
  // ✅ NOVO: Estilos para seleção de gravidade
  gravidadeContainer: {
    gap: 12,
    marginTop: 8,
  },
  gravidadeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
    gap: 12,
  },
  gravidadeOptionSelected: {
    borderColor: colors.textPrimary,
    backgroundColor: colors.tertiary || '#F0F8FF',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.textPrimary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.textPrimary,
  },
  gravidadeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  gravidadeLabelSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
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
