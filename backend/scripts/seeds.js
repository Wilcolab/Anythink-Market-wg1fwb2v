const mongoose = require("mongoose");
require("../models/User");
require("../models/Item");
require("../models/Comment");

mongoose.connect(process.env.MONGODB_URI);

const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

function mockUser(username) {
    return {
        username,
        email: `${username}@gmail.com`
    }
}

function mockItem(index, seller) {
    return {
        slug: `slugs ${index}`,
        title: `title`,
        description: `description`,
        seller,
    }
}

function mockComment(index, seller, item) {
    return {
        body: `body ${index}`,
        seller,
        item,
    }
}

async function seedDB() {
    const options = {
        new: true,
        upsert: true,
    }

    for (let i = 0; i < 100; i++) {
        const user = mockUser(`user${i}`);
        const newUser = await User.findOneAndUpdate(user, {}, options);

        const item = mockItem(i, newUser.id);
        const newItem = await Item.findOneAndUpdate(item, {}, options);

        const comment = mockComment(i, newUser.id, newItem.id);
        await Comment.findOneAndUpdate(comment, {}, options);
    }
}

seedDB().then(() => {
    console.log('********************************************');
    console.log('Seeded Database');
    console.log('********************************************');
    process.exit(0);
}).catch((error) => {
    console.log('********************************************');
    console.log(`Error while seeding database: ${error.message}`);
    console.log('********************************************');
    process.exit(1);
})
