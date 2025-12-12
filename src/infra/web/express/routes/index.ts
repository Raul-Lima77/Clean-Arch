import { Router } from "express"
import UsuarioRoutes from "./UsuarioRoutes"
import TransacaoRoutes from "./TransacaoRoutes"
import CategoriaRoutes from "./CategoriaRoutes"
import MetaRoutes from "./MetaRoutes"

const router = Router()

router.use("/", UsuarioRoutes)
router.use("/", TransacaoRoutes)
router.use("/", CategoriaRoutes)
router.use("/", MetaRoutes)

export default router
