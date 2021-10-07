import express from "express";
import blogCtrl from "../controllers/blogCtrl";
import auth from '../middleware/auth'

const router = express.Router()

router.post('/blog', auth, blogCtrl.createBlog)

router.get('/home/blogs', blogCtrl.getHomeBlog)

router.get('/blogs/category/:id', blogCtrl.getBlogByCategory)

router.get('/blogs/user/:id', blogCtrl.getBlogByUser)

router.get('/blog/:id', blogCtrl.getBlog)

export default router