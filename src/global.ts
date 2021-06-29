const debug = process.env.NODE_ENV !== 'production'

export default {
  debug,
  baseUrl: debug ? 'http://192.168.2.34:3001' : 'http://192.168.2.34:3001',
}