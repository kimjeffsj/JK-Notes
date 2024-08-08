const mainLayout = "../views/layouts/main.ejs";

const notFound = (req, res, next) => {
  return res
    .status(404)
    .render("error", { layout: mainLayout, error: "Page not found" });
};

module.exports = { notFound };
