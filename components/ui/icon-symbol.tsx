// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'plus': 'add',
  'trash.fill': 'delete-forever',

  // __ Navigation & Onglet __

  'magnifyingglass': 'search',
  'gearshape': 'settings',
  'bell': 'notifications',

  // __ Media & Communication __
  'camera': 'photo-camera',
  'video': 'videocam',
  'mic': 'mic',
  'speaker.wave.2': 'volume-up',
  'envelope': 'email',

  // __ Arrows & Directional __
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  'arrow.up': 'arrow-upward',
  'arrow.down': 'arrow-downward',

  // __ Symbols & Shapes __
  'star': 'star',
  'heart': 'favorite',
  'circle': 'circle',
  'square': 'stop',
  'triangle': 'change-history',

  // __ Status & Alerts __
  'exclamationmark.triangle': 'warning',
  'checkmark': 'check',
  'xmark': 'close', 

  // __ Miscellaneous __
  'questionmark': 'help',

  // __Fichiers & Documents & Dossiers__
  'doc': 'save',
  'doc.text': 'article',
  'folder': 'folder',
  'folder.fill': 'folder-open',
  'archivebox': 'archive',

  // __User & Profile__
  'person': 'person',
  'person.fill': 'person',
  'person.2': 'group',
  'person.3': 'group',

  // __Location & Maps__
  'location': 'location-on',
  'location.fill': 'my-location',
  'map': 'map',

  // __Time & Calendar__
  'calendar': 'calendar-today',
  'clock': 'access-time',

  // __Weather & Nature__
  'sun.max': 'wb-sunny',
  'moon': 'nights-stay',

  // __List__
  'list.clipboard.fill': 'assignment',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
