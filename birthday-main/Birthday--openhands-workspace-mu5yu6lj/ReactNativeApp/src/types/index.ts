export interface User {
  uid: string;
  name: string;
  email?: string;
}

export interface Message {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
  uid: string;
  isSystem?: boolean;
  replyTo?: {
    id: string;
    message: string;
    author: string;
  };
}

export interface Album {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'other';
  url: string;
  uuid: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface BirthdayMessage {
  name: string;
  gift: string;
  timestamp: string;
  date: string;
  uid: string;
}

export interface BackgroundSettings {
  url: string;
  uuid: string;
}

export type ScreenType = 
  | 'welcome'
  | 'greeting' 
  | 'birthday-question'
  | 'happy-birthday'
  | 'gift-request'
  | 'no-money'
  | 'thank-you-question'
  | 'force-thank-you'
  | 'final-jai-hind'
  | 'not-birthday'
  | 'date-result'
  | 'chat'
  | 'admin-panel'
  | 'user-albums'
  | 'album-view';