import { MapLayer } from 'ol-cityscope';

/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare interface Config {
  appName: string;
  baseLayers: MapLayer[];
  topicLayers: MapLayer[];
  projectorTransform: {};
}

declare module '*.json' {
  const value: Config;
  export default value;
}
