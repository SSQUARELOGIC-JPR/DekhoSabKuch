// ---------- COMPONENTS ----------

export interface AppInputProps {
  placeholder: string;
  icon: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: any;
  secureTextEntry?: boolean;
  maxLength?: number;
  editable?: boolean;
  autoFocus?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
}

export interface AppButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

// ---------- NAVIGATION ----------

export interface ScreenProps {
  navigation: any;
  route?: any;
}

// ---------- API COMMON ----------

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ---------- ROLE SELECTION ----------
export type RoleType = 'customer' | 'provider' | 'both' | null;

export interface RoleCardProps {
  title: string;
  description: string;
  icon: string;
  value: RoleType;
}

export interface RoleSelectionScreenProps extends ScreenProps {}

export interface UserProfile {
  profileImage?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  role: 'customer' | 'provider' | 'both';
  verificationFile?: {
    uri: string;
    name: string;
    type: string; // image/pdf
  };
}

export interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
}
