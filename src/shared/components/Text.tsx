import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { theme } from '../../core/theme';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';
  color?: string;
  weight?: 'regular' | 'medium' | 'bold';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = theme.colors.text,
  weight = 'regular',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return { fontSize: theme.typography.size.xxxl, lineHeight: theme.typography.lineHeight.xxxl };
      case 'h2':
        return { fontSize: theme.typography.size.xxl, lineHeight: theme.typography.lineHeight.xxl };
      case 'h3':
        return { fontSize: theme.typography.size.xl, lineHeight: theme.typography.lineHeight.xl };
      case 'button':
        return { fontSize: theme.typography.size.md, lineHeight: theme.typography.lineHeight.md, fontWeight: '600' };
      case 'caption':
        return { fontSize: theme.typography.size.sm, lineHeight: theme.typography.lineHeight.sm };
      case 'body':
      default:
        return { fontSize: theme.typography.size.md, lineHeight: theme.typography.lineHeight.md };
    }
  };

  const getFontWeight = (): TextStyle['fontWeight'] => {
    switch (weight) {
      case 'bold': return '700';
      case 'medium': return '500';
      case 'regular':
      default: return '400';
    }
  };

  return (
    <RNText
      style={[
        getVariantStyle(),
        {
          color,
          fontWeight: getFontWeight(),
          textAlign: align,
          fontFamily: theme.typography.fontFamily[weight],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
