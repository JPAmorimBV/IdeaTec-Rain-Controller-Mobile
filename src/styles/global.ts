import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { fonts, textStyles } from './fonts';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Layout
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  
  // Flexbox
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  flex4: { flex: 4 },
  
  // Margens
  m1: { margin: 4 },
  m2: { margin: 8 },
  m3: { margin: 12 },
  m4: { margin: 16 },
  m5: { margin: 20 },
  m6: { margin: 24 },
  
  mt1: { marginTop: 4 },
  mt2: { marginTop: 8 },
  mt3: { marginTop: 12 },
  mt4: { marginTop: 16 },
  mt5: { marginTop: 20 },
  mt6: { marginTop: 24 },
  
  mb1: { marginBottom: 4 },
  mb2: { marginBottom: 8 },
  mb3: { marginBottom: 12 },
  mb4: { marginBottom: 16 },
  mb5: { marginBottom: 20 },
  mb6: { marginBottom: 24 },
  
  ml1: { marginLeft: 4 },
  ml2: { marginLeft: 8 },
  ml3: { marginLeft: 12 },
  ml4: { marginLeft: 16 },
  ml5: { marginLeft: 20 },
  ml6: { marginLeft: 24 },
  
  mr1: { marginRight: 4 },
  mr2: { marginRight: 8 },
  mr3: { marginRight: 12 },
  mr4: { marginRight: 16 },
  mr5: { marginRight: 20 },
  mr6: { marginRight: 24 },
  
  mx1: { marginHorizontal: 4 },
  mx2: { marginHorizontal: 8 },
  mx3: { marginHorizontal: 12 },
  mx4: { marginHorizontal: 16 },
  mx5: { marginHorizontal: 20 },
  mx6: { marginHorizontal: 24 },
  
  my1: { marginVertical: 4 },
  my2: { marginVertical: 8 },
  my3: { marginVertical: 12 },
  my4: { marginVertical: 16 },
  my5: { marginVertical: 20 },
  my6: { marginVertical: 24 },
  
  // Padding
  p1: { padding: 4 },
  p2: { padding: 8 },
  p3: { padding: 12 },
  p4: { padding: 16 },
  p5: { padding: 20 },
  p6: { padding: 24 },
  
  pt1: { paddingTop: 4 },
  pt2: { paddingTop: 8 },
  pt3: { paddingTop: 12 },
  pt4: { paddingTop: 16 },
  pt5: { paddingTop: 20 },
  pt6: { paddingTop: 24 },
  
  pb1: { paddingBottom: 4 },
  pb2: { paddingBottom: 8 },
  pb3: { paddingBottom: 12 },
  pb4: { paddingBottom: 16 },
  pb5: { paddingBottom: 20 },
  pb6: { paddingBottom: 24 },
  
  pl1: { paddingLeft: 4 },
  pl2: { paddingLeft: 8 },
  pl3: { paddingLeft: 12 },
  pl4: { paddingLeft: 16 },
  pl5: { paddingLeft: 20 },
  pl6: { paddingLeft: 24 },
  
  pr1: { paddingRight: 4 },
  pr2: { paddingRight: 8 },
  pr3: { paddingRight: 12 },
  pr4: { paddingRight: 16 },
  pr5: { paddingRight: 20 },
  pr6: { paddingRight: 24 },
  
  px1: { paddingHorizontal: 4 },
  px2: { paddingHorizontal: 8 },
  px3: { paddingHorizontal: 12 },
  px4: { paddingHorizontal: 16 },
  px5: { paddingHorizontal: 20 },
  px6: { paddingHorizontal: 24 },
  
  py1: { paddingVertical: 4 },
  py2: { paddingVertical: 8 },
  py3: { paddingVertical: 12 },
  py4: { paddingVertical: 16 },
  py5: { paddingVertical: 20 },
  py6: { paddingVertical: 24 },
  
  // Tipografia usando os estilos definidos
  h1: textStyles.h1,
  h2: textStyles.h2,
  h3: textStyles.h3,
  h4: textStyles.h4,
  body: textStyles.body,
  bodyLarge: textStyles.bodyLarge,
  bodySmall: textStyles.bodySmall,
  label: textStyles.label,
  labelSmall: textStyles.labelSmall,
  caption: textStyles.caption,
  button: textStyles.button,
  buttonSmall: textStyles.buttonSmall,
  
  // Cores de texto
  textPrimary: { color: colors.textPrimary },
  textSecondary: { color: colors.textSecondary },
  textLight: { color: colors.textLight },
  textWhite: { color: colors.primary },
  textSuccess: { color: colors.success },
  textWarning: { color: colors.warning },
  textDanger: { color: colors.danger },
  textInfo: { color: colors.info },
  
  // Backgrounds
  bgPrimary: { backgroundColor: colors.primary },
  bgSecondary: { backgroundColor: colors.secondary },
  bgCard: { backgroundColor: colors.cardBackground },
  bgSuccess: { backgroundColor: colors.success },
  bgWarning: { backgroundColor: colors.warning },
  bgDanger: { backgroundColor: colors.danger },
  bgInfo: { backgroundColor: colors.info },
  
  // Bordas
  border: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  
  // Border radius
  rounded: { borderRadius: 4 },
  roundedSm: { borderRadius: 2 },
  roundedMd: { borderRadius: 6 },
  roundedLg: { borderRadius: 8 },
  roundedXl: { borderRadius: 12 },
  rounded2xl: { borderRadius: 16 },
  rounded3xl: { borderRadius: 24 },
  roundedFull: { borderRadius: 9999 },
  
  // Sombras
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowLg: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  
  // Opacity
  opacity50: { opacity: 0.5 },
  opacity75: { opacity: 0.75 },
  opacity90: { opacity: 0.9 },
  
  // Position
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  
  // Overflow
  hidden: { overflow: 'hidden' },
  visible: { overflow: 'visible' },
  
  // Width/Height
  fullWidth: { width: '100%' },
  fullHeight: { height: '100%' },
  
  // Text alignment
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  textJustify: { textAlign: 'justify' },
});

// Utilitários de spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// Utilitários de border radius
export const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

// Utilitários de tamanhos
export const sizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
  '3xl': 56,
  '4xl': 64,
  '5xl': 80,
  '6xl': 96,
};
