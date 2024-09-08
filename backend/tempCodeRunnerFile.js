app.get("/", (req, res) => {
  res.redirect("/auth/google"); // Redirect to the Google authentication route
});
