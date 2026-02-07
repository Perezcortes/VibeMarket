import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

const { Request, Response, Headers } = require('whatwg-fetch');
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Parche para que NextResponse.json funcione en tests
if (!global.Response.json) {
  global.Response.json = (data, init) => {
    return new global.Response(JSON.stringify(data), {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(init?.headers || {})
      }
    });
  }
}