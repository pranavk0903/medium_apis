const Blog = require('../models/blogs');
const UserRegister = require('../models/User');
const router = require('./userController');


router.post('/addblogs', async(req, res) => {

    try {
        const userData= await UserRegister.find(
            {tokens:{ $elemMatch:{token: req.headers.token}}},{ name: 1})
    
        const createBlog = new Blog({
            text: req.body.text,
            title: req.body.title,
            desc: req.body.desc,
            name : userData[0].name
        })
        console.log(createBlog);
        res.status(201).send([await createBlog.save(),"Blog posted sucessfully"] )
    } catch (error) {
        console.log(error);
        res.status(501).send(error)

    }
    
});

module.exports = router;