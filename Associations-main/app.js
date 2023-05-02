const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const db = require('./models');
const { json } = require('sequelize');
const users = db.users;
const user_detail = db.user_detail;
const posts = db.posts;
const tags = db.tags;
const post_tag = db.post_tag;
const comments = db.comments;
const images = db.images;
const videos = db.videos; ;

db.sequelize.sync();

app.get("/OnetoOne", async (req, res) => {

  try {
    console.log("data");
    let data = await users.findAll({
      include: [user_detail],
    });
    console.log("data1");
    return res.status(200).json({
      success: "true",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: "false",
      err: err,
    });
  }
});


app.get("/OnetoMany", async (req, res) => {
  try {
    console.log("data");
    let data = await users.findAll({
      include: [posts],
    });
    console.log("data1");
    return res.status(200).json({
      success: "true",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: "false",
      err: err,
    });
  }
});



app.get("/ManytoMany", async (req, res) => {
  try {
    console.log("data");
    let data = await posts.findAll({
      include: [tags],
    });
    console.log("data1");
    return res.status(200).json({
      success: "true",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: "false",
      err: err,
    });
  }
});


//polymorphic one to many 
app.get("/polyonetoMany", async (req, res) => {
  try {
    console.log("data");
    //image  to comment
    // let data = await images.findAll({
    //   include: [{
    //     model:comments
    //   }],
    // });

    //video  to comment
    // let data = await videos.findAll({
    //   include: [{
    //     model:comments
    //   }],
    // });

    //comments to video / image
    let data = await comments.findAll({
      include: [images],
    });
    console.log("data1");
    return res.status(200).json({
      success: "true",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: "false",
      err: err,
    });
  }
});

//polymorphic many  to many 
app.get("/polyManytoMany", async (req, res) => {
  try {
    console.log("data");
    //image  to comment
    // let data = await tags.findAll({
    //   include: [{
    //     model:videos
    //   }],
    // });

    //video  to comment
    // let data = await tags.findAll({
    //   include: [{
    //     model:images
    //   }],
    // });

    //comments to video / image
    let data = await tags.findAll({
      include: [videos, images],
    });
    console.log("data1");
    return res.status(200).json({
      success: "true",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: "false",
      err: err,
    });
  }
});

app.listen(3000, () => {
  console.log("SERVER IS LISTNING");
});


//refrance : https://www.topcoder.com/thrive/articles/many-to-many-relationships-in-mysql-database-using-sequelize-orm
