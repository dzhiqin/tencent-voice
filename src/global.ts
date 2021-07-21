const debug = process.env.NODE_ENV !== 'production'

export default {
  debug,
  baseUrl: debug ? 'http://192.168.2.34:3001/api' : 'http://192.168.2.34:3001/api',
  // baseUrl: debug ? 'http://108.160.133.153:30001/api' : 'https://ai.gdbkyz.com/api',
  // baseUrl: debug ? 'https://ai.gdbkyz.com/api' : 'https://ai.gdbkyz.com/api',
}