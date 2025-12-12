import { Router } from "express"
import { controllers } from "../../../../config/composition-root"

const router = Router()

router.post("/usuarios/cadastro", (req, res) => controllers.usuarioControle.cadastrar(req, res))
router.post("/usuarios/login", (req, res) => controllers.usuarioControle.login(req, res))
router.put("/usuarios/:usuarioId", (req, res) => controllers.usuarioControle.editar(req, res))
router.put("/usuarios/:usuarioId/senha", (req, res) => controllers.usuarioControle.alterarSenhaHandler(req, res))

export default router
