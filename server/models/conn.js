const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mediumdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('connection Successful')
}).catch((error) => {
    console.log('no connection');
});

