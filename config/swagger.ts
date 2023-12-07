export default {
  path: __dirname + '../',
  title: 'Ignite Developer task',
  version: '1.0.0',
  tagIndex: 2,
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT', // if PUT/PATCH are provided for the same rout, prefer PUT
  common: {
    parameters: {},
    headers: {},
  },
}
