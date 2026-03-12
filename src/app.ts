import express, { urlencoded } from 'express'
import { router } from './router.js'

const app = express()

app.use(express.json())
app.use(urlencoded({extended : true}))
app.use("/api/v1" , router)

export default app