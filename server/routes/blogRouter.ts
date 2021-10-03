import express from "express";
import blogCtrl from "../controllers/blogCtrl";
import auth from '../middleware/auth'

const router = express.Router()

router.post('/blog', auth, blogCtrl.createBlog)

router.get('/home/blogs', blogCtrl.getHomeBlog)


export default router