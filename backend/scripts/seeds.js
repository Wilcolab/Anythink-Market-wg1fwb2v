const mongoose = require("mongoose");
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

        const item = mockItem(index, newUser);
        const newItem = await Item.findOneAndUpdate(item, {}, options);

        const comment = mockComment(index, newUser, newItem);
        await Comment.findOneAndUpdate(comment, {}, options);
    }
}

seedDB().then(() => {
    console.log('Seeded Database');
}).catch((error) => {
    console.log(`Error while seeding database: ${error.message}`);
})
