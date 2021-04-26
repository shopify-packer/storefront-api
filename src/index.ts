import type {StorefrontAPISettings} from "./types";

export class StorefrontAPI {
 readonly settings: StorefrontAPISettings = {
   store: "",
   password: "",
   endpoint: "api/2021-04/graphql.json"
 }

  constructor(settings: StorefrontAPISettings) {
    this.settings = {...this.settings, ...settings}
  }

  /**
   * Fetch the graphql query
   * @param {String} query
   * @param {JSON} variables
   * @returns {Promise<Response>}
   */
  fetch(query: string, variables?: JSON): Promise<Response> {
    const request = new Request(`https://${this.settings.store}/${this.settings.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Shopify-Storefront-Access-Token': this.settings.password,
      },
      body: JSON.stringify({query: query, variables: { ...variables }})
    })
    return fetch(request)
  }

  /**
   * Decode base64 Storefront ID
   * @param {String} id
   * @returns {String}
   */
  decodeId(id: string): string {
    return window.atob(id).split('/').pop()
  }

  /**
   * Decodes all ids from response
   * @param {Object} response
   */
  decodeIds(response: Record<string, unknown>): Record<string, unknown> {
    return this._parseObject(response, (object: Record<string, unknown>) => {
      if (Object.keys(object).includes('id') && typeof object.id === 'string') {
        object.id = this.decodeId(object.id)
      }
      return object
    })
  }

  /**
   * Parse and object and all sub objects, running a callback on each
   * @param {Object} response
   * @param {CallableFunction} callback
   * @returns {Object}
   * @protected
   */
  protected _parseObject(response: Record<string, unknown>, callback: CallableFunction): Record<string, unknown> {
    const inspect = (object: unknown) => {
      if (object !== null && typeof object == "object") {
        callback(object)
        Object.entries(object).forEach(([key, value]) => {
          if (value !== null && typeof value === 'object' && typeof key === 'string') {
            inspect(value)
          }
        });
      }
      return response
    }
    return inspect(response)
  }
}
