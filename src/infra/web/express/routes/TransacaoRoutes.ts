import { Router } from "express"
import { controllers } from "../../../../config/composition-root"

const router = Router()

router.post("/transacoes", (req, res) => controllers.transacaoControle.criar(req, res))
router.put("/transacoes/:id", (req, res) => controllers.transacaoControle.editar(req, res))
router.delete("/transacoes/:id", (req, res) => controllers.transacaoControle.remover(req, res))
router.get("/transacoes/:usuarioId", (req, res) => controllers.transacaoControle.listar(req, res))
router.get("/transacoes/:usuarioId/filtrar", (req, res) => controllers.transacaoControle.filtrar(req, res))

export default router
