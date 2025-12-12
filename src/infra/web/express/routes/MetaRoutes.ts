import { Router } from "express"
import { controllers } from "../../../../config/composition-root"

const router = Router()

router.post("/metas", (req, res) => controllers.metaControle.criar(req, res))
router.get("/metas/:usuarioId", (req, res) => controllers.metaControle.listar(req, res))
router.delete("/metas/:id", (req, res) => controllers.metaControle.remover(req, res))

export default router
