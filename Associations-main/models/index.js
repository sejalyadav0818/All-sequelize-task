'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const { strict } = require('assert');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.users = require("./users")(sequelize, Sequelize);
db.user_detail = require("./user_detail")(sequelize, Sequelize);
db.posts = require("./posts")(sequelize, Sequelize);
db.post_tag = require("./post_tag")(sequelize, Sequelize);
db.tags = require("./tags")(sequelize, Sequelize);
db.comments = require("./comment")(sequelize, Sequelize);
db.images = require("./images")(sequelize, Sequelize);
db.videos = require("./video")(sequelize, Sequelize);
db.tag_taggable = require("./tag_taggable")(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//one to one
db.users.hasOne(db.user_detail, {
  foreignKey: "user_id",
 
});
db.user_detail.belongsTo(db.users, { foreignKey: "user_id" });

//one to many 
db.users.hasMany(db.posts, {
  foreignKey: "user_id",
});
db.posts.belongsTo(db.users, { foreignKey: "user_id" });



//many to many 
db.posts.belongsToMany(db.tags, {
  through: "post_tag",
});
db.tags.belongsToMany(db.posts, { through: "post_tag" });



//polymorphic one to many 

db.images.hasMany(db.comments, {
  foreignKey: "commentableid",
  constraints: false,
  scope: {
    commentableType :'image'
  },
});

db.videos.hasMany(db.comments, {
  foreignKey: "commentableid",
  constraints: false,
  scope: {
    commentableType: "video",
  },
});


db.comments.belongsTo(db.images, { foreignKey: "commentableid", constraints: false});
db.comments.belongsTo(db.videos, { foreignKey: "commentableid", constraints: false});

//polymorphic many to many 
//image to tag 
db.images.belongsToMany(db.tags,{
  through :
  {
    model:db.tag_taggable,
    unique :false,
    scope:{
      taggableType : 'image'
    }
  },
  foreignKey :'taggableId',
  constraints:false
});

//tag to image 
db.tags.belongsToMany(db.images, {
  through: {
    model: db.tag_taggable,
    unique: false,
    scope: {
      taggableType: "image",
    },
  },
  foreignKey: "taggableId",
  constraints: false,
});

//video to tag
db.videos.belongsToMany(db.tags, {
  through: {
    model: db.tag_taggable,
    unique: false,
    scope: {
      taggableType: "video",
    },
  },
  foreignKey: "taggableId",
  constraints: false,
});
//tag to video 
db.tags.belongsToMany(db.videos, {
  through: {
    model: db.tag_taggable,
    unique: false,
    scope: {
      taggableType: "video",
    },
  },
  foreignKey: "taggableId",
  constraints: false,
});


db.sequelize.sync({ force: false }).then(() => {
  console.log("re sync");
});


module.exports = db;
  

