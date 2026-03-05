import { TextInputProps } from 'react-native';

// ---------- COMMON TYPES ----------
export type RoleType = 'customer' | 'provider' | 'both' | null;

export interface FileAsset {
  uri: string;
  name: string;
  type: string; // image / pdf
}

export interface UserProfile {
  profileImage?: string | null;
  name: string;
  village: string;
  tehsil: string;
  city: string;
  state: string;
  pincode: string;

  role: Exclude<RoleType, null>;

  // Aadhaar (provider / both)
  aadharFrontImage?: string | null;
  aadharBackImage?: string | null;

  // 🔥 NEW (Provider fields)
  category?: string;
  experience?: number;
  about?: string;
}

// ---------- AUTH USER ----------
export interface AuthUser extends Partial<UserProfile> {
  mobile: string;
  role: Exclude<RoleType, null>;

  profileDone: boolean;
  paymentDone: boolean;

  // granular backend flags
  isUserProfileComplete?: boolean;
  isProviderProfileComplete?: boolean;
}

// ---------- COMPONENTS ----------
export interface AppInputProps {
  placeholder: string;
  icon: string;
  value: string;
  onChangeText?: (text: string) => void;
  keyboardType?: any;
  secureTextEntry?: boolean;
  maxLength?: number;
  editable?: boolean;
  autoFocus?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';

  // 🔥 NEW
  multiline?: boolean;
  numberOfLines?: number;
  inputStyle?: any;
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
  _id: string;
  name: string;
  category: string;
  rating: number;
  city: string;
  phone: string;
  profileImage: string;
}

export interface ProviderListProps {
  data: Provider[];
  currentUserId?: string;
  onBlockedPress?: () => void;
  onCall?: (phone: string, providerId: string) => void;
  onMessage?: (phone: string, providerId: string) => void;
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
      token?: string;       
      user?: AuthUser;
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

// ---------- ERROR BANNER ----------
export type BannerType = 'error' | 'success' | 'warning';

export interface ErrorBannerProps {
  message: string;
  type?: BannerType;
  duration?: number;
}

// ---------- SUPPORT TICKET MODAL ----------
export interface SupportTicketModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: string;
    summary: string;
    description: string;
  }) => void | Promise<void>;
  loading?: boolean;
}
// ---------- DELETE ACCOUNT MODAL ----------
export interface DeleteAccountModalProps {
  visible: boolean;
  phone: string;
  onClose: () => void;
  onConfirm: () => void;
}
// ---------- GLOBAL ERROR STATE ----------
export interface GlobalErrorState {
  message: string;
  type: BannerType;
}