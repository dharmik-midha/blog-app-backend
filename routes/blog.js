const express = require("express");
const checkAuth = require("../middleware/check-auth");
const Blog = require("../models/blog");
const router = express.Router();

router.get("/", checkAuth, (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const blogQuery = Blog.find().populate("createdBy", { name: 1, email: 2 });
  let fetchedBlogs;
  if (pageSize && currentPage) {
    blogQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  blogQuery
    .then((data) => {
      fetchedBlogs = data;
      return Blog.count();
    })
    .then((count) => {
      res.status(200).json({
        msg: "Blogs Fetched Successfully!",
        data: fetchedBlogs,
        maxBlogs: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Internal Server Error!",
      });
    });
});

router.post("/", checkAuth, (req, res) => {
  const blog = Blog.create(req.body);

  blog
    .then(async (result) => {
      const resBlog = await Blog.findById({ _id: result._id }).populate(
        "createdBy",
        { name: 1, email: 2 }
      );
      res.status(201).json({
        msg: "Blog added Successfully!",
        data: resBlog,
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: String(err),
      });
    });
});

router.get("/:id", checkAuth, (req, res) => {
  Blog.findById({ _id: req.params.id })
    .populate("createdBy", { name: 1, email: 2 })
    .then((result) => {
      if (result != null) {
        return res.status(200).json({
          msg: "Blog Found",
          data: result,
        });
      }
      res.status(404).json({
        msg: "Not Found!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Internal Server Error!",
      });
    });
});

router.delete("/:id", (req, res) => {
  Blog.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).json({
        msg: "Blog Deleted Successfully",
      });
    })
    .catch(() => {
      res.status(404).json({
        msg: "Blog not Found",
      });
    });
});

router.patch("/:id", (req, res) => {
  Blog.updateOne({ _id: req.params.id }, req.body)
    .then((result) => {
      res.status(201).json({
        msg: "Blog Updated Successfully!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Internal Server Error!",
      });
    });
});
router.patch("/:id/like", async (req, res) => {
  var blog;
  await Blog.findOne({ _id: req.params.id })
    .then((result) => {
      let findIndex = result.likes.findIndex((e) => e.equals(req.body._id));
      findIndex > -1
        ? result.likes.splice(findIndex, 1)
        : result.likes.push(req.body);
      blog = result;
    })
    .catch((err) =>
      res.status(500).json({
        msg: "Internal Server Error!",
      })
    );

  Blog.updateOne({ _id: req.params.id }, blog)
    .then(async (result) => {
      const getBlog = await Blog.findById({ _id: req.params.id }).populate(
        "createdBy",
        { name: 1, email: 2 }
      );
      res.status(201).json({
        msg: "Blog Liked Successfully!",
        data: getBlog,
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "Internal Server Error!",
      });
    });
});
module.exports = router;
