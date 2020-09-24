// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  geoserverUrl: 'http://0.0.0.0:8080/geoserver',
  wampUrl: 'ws://0.0.0.0:8081/ws',
  wampRealm: 'realm',
  nodeUrl: 'http://0.0.0.0:8082',
  websocket_prefix: ''
};
