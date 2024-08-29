import { bbb } from "src/bbb.ts";
import { message } from "./aaa.ts";

// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";

const app = express();

app.get("/", function (_req, res) {
    res.send(message("hello") + bbb());
});

app.listen(3000, () => {
    console.log("Express listening on :3000");
});

