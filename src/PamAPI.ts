export class PamAPI {
  baseApiPath: string;

  constructor(baseApiPath: string) {
    this.baseApiPath = baseApiPath;
  }

  async loadAppAttention(
    pageName: string,
    contactID: string
  ): Promise<Record<string, any> | undefined> {
    if (!contactID) {
      return undefined;
    }

    try {
      const response = await fetch(`${this.baseApiPath}/app-attention`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          page_name: pageName,
          _contact_id: contactID,
        }),
      });
      console.log('status', response.status);
      if (response.status < 200 || response.status > 299) {
        return undefined;
      }

      const data = await response.json();

      if (Object.keys(data).length === 0) {
        return undefined;
      }

      return data;
    } catch (error: any) {
      console.error('Error:', error.message);
      return undefined;
    }
  }
}
