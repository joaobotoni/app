import { IconProps } from '@/app/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = '#000000' 
}) => {
  return (
    <Ionicons 
      name={name as any} 
      size={size} 
      color={color} 
    />
  );
};