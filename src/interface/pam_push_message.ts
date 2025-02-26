export interface PamPushMessage {
  deliverID?: string;
  pixel?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  flex?: string;
  url?: string;
  popupType?: string;
  bisOpen?: boolean;
  date?: Date;
  data?: Record<string, any>;
}
