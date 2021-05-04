export class HttpService {
  // Returns a response body of type T if successful, if not then returns a generic
  // HTTP response.
  public static async get<T>(url: string): Promise<T | Response> {
    const response = await fetch(url);
    try {
      const body = await response.json();
      return body;
    } catch (error) {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response;
    }
  }
}
