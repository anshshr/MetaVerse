import {Router} from 'express'
import { AuthRouter } from './http/modules/auth/auth.routes.js'

export const router = Router()

router.use("/auth" , AuthRouter)

