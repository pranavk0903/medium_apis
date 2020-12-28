const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
    {
        text: String,
        title: String,
        desc: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: [
            {
                author: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                text: String
            }
        ]
    }
);

blogSchema.methods.comment = function(c) {
    this.comments.push(c)
    return this.save()
}
blogSchema.methods.addAuthor = function (author_id) {
    this.author = author_id
    return this.save()
}
blogSchema.methods.getUserArticle = function (_id) {
    Article.find({'author': _id}).then((article) => {
        return article
    })
}


module.exports = new mongoose.model('Blog', blogSchema);;
