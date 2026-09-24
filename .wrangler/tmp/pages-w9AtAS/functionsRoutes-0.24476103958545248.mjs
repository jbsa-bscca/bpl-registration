import { onRequestPost as __api_submit_ts_onRequestPost } from "/home/lordbandhan/jbsa-cricket/cricket-registration/functions/api/submit.ts"

export const routes = [
    {
      routePath: "/api/submit",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_submit_ts_onRequestPost],
    },
  ]