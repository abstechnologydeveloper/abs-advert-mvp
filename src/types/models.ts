// ==================== ENUMS ====================

export type CampaignStatus = "PENDING" | "SENT" | "FAILED" | "DRAFT" | "SCHEDULED";
export type InstituitionType =
  | "Polytechnic"
  | "University"
  | "College"
  | "Technical"
  | "Monotechnic";

export type CampaignType = "FCM" | "EMAIL";
export type AdsNotificationType =
  | "CREATED"
  | "SCHEDULED"
  | "SENT"
  | "FAILED"
  | "APPROVED"
  | "CANCELLED";
export type StudentStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type StudentType = "UNDERGRADUATE" | "POSTGRADUATE" | "OTHER";

// ==================== MODELS ====================

export interface ProfilePicture {
  profileId: string;
  imageId: string;
  profilePicture: string;
  companyName: string;
  imagePath?: string;
  studentId: string;
  createdAt: Date;
  updatedAt: Date;
  student?: Student; // relation
}

export interface Student {
  studentId: string;
  email: string;
  password: string;
  avatar?: string;
  profileCompleted?: boolean;
  tokenExpirationTime?: Date;
  otp?: string;
  emailVerification?: boolean;
  dateOfBirth?: Date;
  userName?: string;
  firstName?: string;
  lastName?: string;
  institution?: string;
  studentType?: StudentType;
  gender?: string;
  department?: string;
  level?: string;
  companyName: string;
  role: string;
  absAdminId: string;
  phoneNumber?: string;
  status: StudentStatus;
  userAdminUserId?: string;
  createdAt: Date;
  updatedAt: Date;
  userDeviceToken?: string;
  badgeRole?: string;
  badgeRoleComment?: string;
  absHelpfulAccount: boolean;
  coverPhoto: string;
  aboutYou?: string;
  blockedUsers: string[];
  isBot?: boolean;
  statusChange: boolean;
  tags: string[];
  userAppReviews: boolean;
  profilePicture?: ProfilePicture;
  adminPermissions?: AdminPermission[];
}

export interface AdminPermission {
  id: string;
  studentId: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  student?: Student;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  targetAll: boolean;
  departments: string[];
  levels: string[];
  institutions: string[];
  sendNow: boolean;
  sendAt?: Date;
  recurring: boolean;
  timeSlots: string[];
  status: CampaignStatus;
  createdAt: Date;
  updatedAt: Date;
  campaignType?: CampaignType;
  studentId?: string;
  attachments?: unknown;
  emailsSent: number;
  emailsFailed: number;
  student?: Student;
  adsNotifications?: AdsNotification[];
}

export interface AdsNotification {
  id: string;
  campaignId?: string;
  studentId: string;
  type: AdsNotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  campaign?: Campaign;
  student?: Student;
}

export interface NotificationPreference {
  id: string;
  studentId: string;
  emailNotifications: boolean;
  campaignUpdates: boolean;
  weeklyReports: boolean;
  marketingEmails: boolean;
  createdAt: Date;
  updatedAt: Date;
  student?: Student;
}

export interface Institution {
  institutionId: string;
  name: string;
  address: string;
  companyName: string;
  state: string;
  country: string;
  absAdminId?: string | null;
  adminUserId?: string | null;
  createdAt: string;
  updatedAt: string;
  departments?: string[];
  levels?: string[];
  institutionAbbreviation?: string | null;
  instituitionType?: InstituitionType | null;
}
