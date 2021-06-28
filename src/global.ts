const debug = process.env.NODE_ENV !== 'production'

export default {
  debug,
  baseUrl: debug ? 'http://localhost:3000' : 'http://localhost:3000',
}
