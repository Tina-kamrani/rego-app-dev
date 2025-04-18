import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, useColorScheme, Text } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';

const HEADER_HEIGHT = 20;

type Props = PropsWithChildren<{
  // headerImage: ReactElement;
  // headerBackgroundColor: { dark: string; light: string };
  headerTitle: string;
}>;

export default function ParallaxScrollView({
  children,
  // headerImage,
  // headerBackgroundColor,
  headerTitle
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.View
          style={[
            // styles.header,
            // { backgroundColor: headerBackgroundColor[colorScheme] },
            // headerAnimatedStyle,
          ]}>
          {/* {headerImage} */}
          {/* <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">{ headerTitle }</ThemedText>
          </ThemedView> */}
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  header: {
    height: 10,
    overflow: 'hidden',
    margin: '5%'
  },
  content: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    gap: 16,
    overflow: 'hidden',
  },
});
