const express = require("express");
const Category = require("../models/categories");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.get("/",checkAuth, (req, res) => {
  Category
    .find()
    .then((data) => {
      res.status(200).json({
        msg: "Categories Fetched Successfully",
        data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Internal Server Error",
        error: err.message,
      });
    });
});

router.post("/", checkAuth, (req, res) => {
    const category = new Category(req.body);
  
    category
      .save()
      .then((result) => {
        res.status(201).json({
          msg: "Category added Successfully!",
          category: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          msg: String(err),
        });
      });
  });


router.delete("/:id", (req, res) => {
    Category.deleteOne({ _id: req.params.id })
      .then((result) => {
        console.log(result);
        res.status(200).json({
          msg: "Category Deleted Successfully",
        });
      })
      .catch(() => {
        res.status(404).json({
          msg: "Category not Found",
        });
      });
  });
  
router.patch("/:id", (req, res) => {
    Category.updateOne({ _id: req.params.id }, req.body)
      .then((result) => {
        res.status(201).json({
          msg: "Category Updated Successfully!",
        });
      })
      .catch((err) => {
        res.status(500).json({
          msg: "Internal Server Error!",
        });
      });
  });
  

module.exports = router;