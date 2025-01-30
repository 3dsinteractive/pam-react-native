// src/PamAPI.ts
var PamAPI = class {
  baseApiPath;
  constructor(baseApiPath) {
    this.baseApiPath = baseApiPath;
  }
  async loadAppAttention(pageName, contactID) {
    if (!contactID) {
      return void 0;
    }
    try {
      const response = await fetch(`${this.baseApiPath}/app-attention`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          page_name: pageName,
          _contact_id: contactID
        })
      });
      console.log("status", response.status);
      if (response.status < 200 || response.status > 299) {
        return void 0;
      }
      const data = await response.json();
      if (Object.keys(data).length === 0) {
        return void 0;
      }
      return data;
    } catch (error) {
      console.error("Error:", error.message);
      return void 0;
    }
  }
};

export {
  PamAPI
};
