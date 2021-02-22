export default function (config, env, helpers) {
  const { plugin } = helpers.getPluginsByName(config, 'DefinePlugin')[0]
  require('dotenv').config()
  Object.assign(
    plugin.definitions,
    ['SERVER_URL'].reduce(
      (env, key) => ({
        ...env,
        [`process.env.${key}`]: JSON.stringify(process.env[key]),
      }),
      {}
    )
  )
}