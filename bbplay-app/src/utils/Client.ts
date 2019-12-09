
interface RequestInitWithJson extends RequestInit {
  json?: any;
}

class Client {
  baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  request(url: string, init?: RequestInitWithJson | undefined): Promise<Response> {
    if (url[0] == '/') {
      url = this.baseUrl + url
    }
    init = init || {}
    init.credentials = 'include'
    if (init.json != null) {
      init.body = JSON.stringify(init.json)
      // TODO (@NiklasRosenstein): Support other types of header inits
      let headers = (init.headers || {}) as Record<string, string>
      headers['Content-Type'] = 'application/json'
      init.headers = headers
    }
    return fetch(url, init)
  }

  async requestJson(url: string, init?: RequestInitWithJson | undefined): Promise<any> {
    return (await this.request(url, init)).json()
  }

}

export default Client;
