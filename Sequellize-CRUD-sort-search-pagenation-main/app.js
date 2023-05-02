const express = require("express");
const { sequelize, students } = require("./models"); // import models
const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const { log } = require("console");
const app = express();
app.use(bodyParser.json());

// Get all users
app.get("/Student", async (req, res) => {
  try {
    const users = await students.findAll();
    res.json({
      data: {
        users: users,
      },
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: null,
      error: {
        success: false,
        message: "Unable to retrieve Student",
        errorMessage: error.message,
      },
    });
  }
});

//search  + sort  + pagenation
app.get("/users/search", async (req, res) => {
  const { query, order, page, limit } = req.query;
  const offset = (page - 1) * limit;

  // console.log(searchf, searchl, searche);
  const queryOptions = await students.findAndCountAll({
    where: {
      [Op.or]: [
        {
          name: { [Op.like]: `%${query}%` },
        },
        {
          email: { [Op.like]: `%${query}%` },
        },
      ],
    },
    order: [
      order === "desc" ? ["name", "DESC"] : ["name", "ASC"],
      order === "desc" ? ["email", "DESC"] : ["name", "ASC"],
    ],

    limit: parseInt(limit),
    offset: offset,
  });

  const totalPages = Math.ceil(queryOptions.count / limit);

  res.json({
    data: {
      users: queryOptions.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: totalPages,
        totalResults: queryOptions.count,
      },
    },
    error: null,
  });
});

//localhost:8000/users/search?query=yadav&page=1&limit=3

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const { name, email} = req.body;
    const user = await students.create({ name, email});
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to create user",
      error: error.message,
    });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await students.findAll();
    res.json({
      data: {
        users: users,
      },
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: null,
      error: {
        success: false,
        message: "Unable to retrieve users",
        errorMessage: error.message,
      },
    });
  }
});

// Get a user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await students.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        error: null,
      });
    } else {
      res.json({
        success: true,
        message: "User retrieved successfully",
        data: user,
        error: null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve user",
      data: null,
      error: error.message,
    });
  }
});

// Update a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const user = await students.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      const { name, email } = req.body;
      await user.update({ name, email });
      res.json({
        success: true,
        message: "User updated successfully",
        user: user,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to update user",
      error: error.message,
    });
  }
});

// Delete a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await students.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      await user.destroy();
      res.json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to delete user",
      error: error.message,
    });
  }
});

//soft delete https://www.topcoder.com/thrive/articles/paranoid-tables-in-sequelize-orm-implementing-soft-delete
app.listen(8000, () => console.log("server is listen on port 3000"));
