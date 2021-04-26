import {StorefrontAPI} from "../index";
import {jest} from '@jest/globals';
import 'whatwg-fetch';
import {graphqlResponse, graphqlId} from './fixtures/response'
import {validConfig, invalidConfig} from "./fixtures/config";

beforeEach(async () => {
  jest.spyOn(global, "fetch").mockImplementation((req: Request) => {
    if (req.headers.get('x-shopify-storefront-access-token').length < 1) {
      return Promise.reject('Missing storefront access token')
    }
    const data = new Response(JSON.stringify(graphqlResponse))
    return Promise.resolve(data)
  })
})

test('Fetch query returns data', async () => {
  const storefrontAPI = new StorefrontAPI(validConfig)
  const data = await storefrontAPI.fetch('')
  const json = await data.json()
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(json).toMatchSnapshot();
});

test('Decode all encoded shopify ids from a fetch response', async () => {
  const storefrontAPI = new StorefrontAPI(validConfig)
  const data = await storefrontAPI.fetch('')
  const json = await data.json()
  const decoded = storefrontAPI.decodeIds(json.data.collections)
  expect(decoded).toMatchSnapshot();
});

test('Invalid config returns error',  async () => {
  const storefrontAPI = new StorefrontAPI(invalidConfig)
  await expect(storefrontAPI.fetch('')).rejects.toMatch('Missing storefront access token')
});

test('Decode Shopify graphql id',  () => {
  const storefrontAPI = new StorefrontAPI(validConfig)
  expect(storefrontAPI.decodeId(graphqlId)).toMatchSnapshot()
});

