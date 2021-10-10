import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())

// socket io
const http = createServer(app)
export const io = new Server(http)
import { SocketServer } from './config/socket'

io.on("connection", (socket: Socket) => SocketServer(socket))

// Routes
app.use('/api', routes.authRouter)
app.use('/api', routes.userRouter)
app.use('/api', routes.categoryRouter)
app.use('/api', routes.blogRouter)
app.use('/api', routes.commentRouter)

// database
import './config/database'


// server port
const PORT = process.env.PORT || 5000
http.listen(PORT, () => {
    console.log("server runing: ", PORT)
})