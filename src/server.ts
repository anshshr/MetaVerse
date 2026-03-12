import app from "./app.js";
import "./config/env.js";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is listening at the port ${PORT}`);
});
