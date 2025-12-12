import { ApiExpress } from "./infra/web/express/ApiExpress"
import routes from "./infra/web/express/routes"

function main() {
  const app = new ApiExpress(routes)
  app.start(3000)
}

main()
