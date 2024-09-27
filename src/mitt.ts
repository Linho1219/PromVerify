import mitt from "mitt";
const emitter = mitt<Events>();
export type Events = {
  "on-search-order": string;
};
export default emitter;
