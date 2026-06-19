import { ApiExpress } from "../../infra/web/express/ApiExpress"
import routes from "../../infra/web/express/routes"

export const app = new ApiExpress(routes).getApp()
export default app
