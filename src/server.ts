import app from "./app.js";
import "./config/env.js";
import "./websocket/index.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server is listening at the port ${PORT}`);
});
