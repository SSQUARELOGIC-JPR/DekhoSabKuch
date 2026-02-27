import { TextInputProps } from 'react-native';

// ---------- COMMON TYPES ----------
export type RoleType = 'customer' | 'provider' | 'both' | null;

export interface FileAsset {
  uri: string;
  name: string;
  type: string; // image / pdf
}

// ---------- USER PROFILE ----------
export interface UserProfile {
  profileImage?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  role: Exclude<RoleType, null>;
  aadharFront?: string;
  aadharBack?: string;
  verificationFile?: FileAsset;
}

// ---------- AUTH USER ----------
export interface AuthUser extends Partial<UserProfile> {
  mobile: string;
  role: Exclude<RoleType, null>;
  profileDone: boolean;
  paymentDone: boolean;
}

// ---------- COMPONENTS ----------
export interface AppInputProps {
  placeholder: string;
  icon: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  maxLength?: number;
  editable?: boolean;
  autoFocus?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  returnKeyType?: TextInputProps['returnKeyType'];
}

export interface AppButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

// ---------- NAVIGATION ----------
export interface ScreenProps<T = any> {
  navigation: T;
  route?: any;
}
export interface Category {
  id: string;
  name: string;
  icon: string;
}
export interface CategoryListProps {
  selected: string;
  onSelect: (category: string) => void;
}
// ---------- HOME ----------
export interface Provider {
  id: string;
  name: string;
  category: string;
  rating: number;
  city: string;
  phone: string;
}

export interface ProviderListProps {
  data: Provider[];
  onBlockedPress?: () => void;
  onCall?: (phone: string) => void;
  onMessage?: (phone: string) => void;
  onViewProfile?: (provider: Provider) => void;
}

// ---------- GENERIC MODAL ----------
export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  onOk: () => void;
  showLater?: boolean;

  // 🔥 new optional props
  okText?: string;
  laterText?: string;
}

// ---------- ROLE SELECTION ----------
export interface RoleCardProps {
  title: string;
  description: string;
  icon: string;
  value: RoleType;
}

export interface RoleSelectionScreenProps {
  route: {
    params?: {
      mobile?: string;
    };
  };
}
// ---------- IMAGE PICKER MODAL ----------
export interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
}