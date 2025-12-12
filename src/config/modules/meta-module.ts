import { CreateMeta } from "../../aplicacao/usecase/meta/CreateMeta"
import { ListMeta } from "../../aplicacao/usecase/meta/ListMeta"
import { DeleteMeta } from "../../aplicacao/usecase/meta/DeleteMeta"
import { MetaRepositorioMysql } from "../../infra/bd/mysql/MetaRepositorioMysql"
import { MetaControle } from "../../infra/web/express/controle/MetaControle"

const metaRepositorio = new MetaRepositorioMysql()

const createMeta = new CreateMeta(metaRepositorio)
const listMeta = new ListMeta(metaRepositorio)
const deleteMeta = new DeleteMeta(metaRepositorio)

export const metaControle = new MetaControle(createMeta, listMeta, deleteMeta)
