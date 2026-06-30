import React from 'react';
import { ViewProps } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

export interface AnimatedListItemProps extends ViewProps {
  index: number;
  delay?: number;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  index,
  delay = 50,
  children,
  style,
  ...props
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * delay).duration(300)}
      layout={Layout.springify()}
      style={style}
      {...props}
    >
      {children}
    </Animated.View>
  );
};
