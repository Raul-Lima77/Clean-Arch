import { Router } from "express"
import { controllers } from "../../../../config/composition-root"

const router = Router()

router.post("/categorias", (req, res) => controllers.categoriaControle.criar(req, res))
router.put("/categorias/:id", (req, res) => controllers.categoriaControle.editar(req, res))
router.delete("/categorias/:id", (req, res) => controllers.categoriaControle.remover(req, res))
router.get("/categorias/:usuarioId", (req, res) => controllers.categoriaControle.listar(req, res))

export default router
