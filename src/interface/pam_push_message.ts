export class PamPushMessage {
  deliverID?: string;
  pixel?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  flex?: string;
  url?: string;
  popupType?: string;
  isOpen?: boolean;
  date?: Date;
  data?: Record<string, any>;
  bannerUrl?: string;

  constructor(
    deliverID: string,
    pixel: string,
    title: string,
    description: string,
    thumbnailUrl: string,
    bannerUrl: string,
    flex: string,
    url: string,
    popupType: string,
    date: Date,
    isOpen: boolean,
    data: Record<string, any>
  ) {
    this.deliverID = deliverID;
    this.pixel = pixel;
    this.title = title;
    this.description = description;
    this.thumbnailUrl = thumbnailUrl;
    this.bannerUrl = bannerUrl;
    this.flex = flex;
    this.url = url;
    this.popupType = popupType;
    this.date = date;
    this.isOpen = isOpen;
    this.data = data;
  }

  trackOpen() {
    if (this.pixel) {
      fetch(this.pixel, {
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        })
        .catch((error) => {
          console.error(
            'There has been a problem with your fetch operation:',
            error
          );
        });
    }
  }

  static parseFromResponse(items: any[]): PamPushMessage[] {
    return items.map((data) => {
      return PamPushMessage.fromNotificationData(data);
    });
  }

  private static fromNotificationData(
    data: Record<string, any>
  ): PamPushMessage {
    const payload = data.json_data.pam;

    return new PamPushMessage(
      data.deliver_id,
      data.pixel,
      data.title,
      data.description,
      data.thumbnail_url,
      data.banner_url,
      data.flex,
      data.url,
      payload.popupType,
      new Date(data.created_date + 'Z'),
      data.is_open,
      payload
    );
  }
}
