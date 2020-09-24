import { Feature } from 'geojson';

export interface Comment extends Feature {
  properties: {
    id: number,
    workshop: string,
    fsk: string,
    timestamp: string,
    text: string,
    reply_to: number,
    status: number
  };
}
