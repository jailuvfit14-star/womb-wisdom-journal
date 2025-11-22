/**
 * Theme Configuration for Aurora Journal
 * Defines all available color themes with their palettes
 */

export interface ThemeColors {
  background: string;
  surface: string;
  accent: string;
  text: string;
  textLight: string;
  border: string;
  borderLight: string;
  hover: string;
  buttonBg: string;
  buttonHover: string;
  buttonText: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export const themes: Record<string, Theme> = {
  womb: {
    id: 'womb',
    name: 'Blush + Brown',
    colors: {
      background: '#FFF6EE',
      surface: '#F5D9CF',
      accent: '#D8A15F',
      text: '#8B5A33',
      textLight: '#a4907f',
      border: '#f7b5ba',
      borderLight: '#fbd9db',
      hover: '#fdeced',
      buttonBg: '#c4947a',
      buttonHover: '#b07a5e',
      buttonText: '#ffffff',
    },
  },
  lavender: {
    id: 'lavender',
    name: 'Soft Lavender Moon',
    colors: {
      background: '#F8F6FB',
      surface: '#E8DBF0',
      accent: '#B08CC9',
      text: '#5D4B6D',
      textLight: '#8B7A9B',
      border: '#D4BFE0',
      borderLight: '#EBE0F2',
      hover: '#F3EDF8',
      buttonBg: '#9B7DB3',
      buttonHover: '#8A6CA1',
      buttonText: '#ffffff',
    },
  },
  earth: {
    id: 'earth',
    name: 'Earthy Womb Gold',
    colors: {
      background: '#F4EFEA',
      surface: '#E8C7B3',
      accent: '#8B5A33',
      text: '#3A2A1C',
      textLight: '#6B5544',
      border: '#C9A88A',
      borderLight: '#E0D1C3',
      hover: '#F9F5F1',
      buttonBg: '#A67C52',
      buttonHover: '#8B5A33',
      buttonText: '#ffffff',
    },
  },
  night: {
    id: 'night',
    name: 'Midnight Stillness',
    colors: {
      background: '#1B1A17',
      surface: '#2E2B26',
      accent: '#C89F65',
      text: '#F1E7D8',
      textLight: '#C4B8A8',
      border: '#423F38',
      borderLight: '#38352F',
      hover: '#3A3732',
      buttonBg: '#A88652',
      buttonHover: '#C89F65',
      buttonText: '#1B1A17',
    },
  },
};

export type ThemeId = keyof typeof themes;

export const defaultTheme: ThemeId = 'womb';
