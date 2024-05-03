const mongoose = require("mongoose");
const Chat = require("./models/Chat");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Chat-App");
}

let allChats = [
  {
    from: "neha",
    to: "preeti",
    msg: "Send me notes",
    created_at: new Date(),
  },

  {
    from: "neha",
    to: "arif",
    msg: "Kuch Nahi",
    created_at: new Date(),
  },
  {
    from: "khalid",
    to: "arif",
    msg: "How are You",
    created_at: new Date(),
  },
  {
    from: "arif",
    to: "khalid",
    msg: "I am fine",
    created_at: new Date(),
  },
];

Chat.insertMany(allChats);
