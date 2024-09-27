import mitt from "mitt";
const emitter = mitt<Events>();
export type Events = {
  "on-search-order": string; // infoCard -> Numpad
  "on-toogle-info": boolean; // infoView -> Header
  "on-refresh-counter": {
    inCount: number;
    outCount: number;
  }; // infoView -> Header
  "on-refresh-delay": number; // infoView -> Header
};
export default emitter;
