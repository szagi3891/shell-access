import { bbb } from "./ser/bbb.ts";
import { message } from "./ser/aaa.ts";

// @deno-types="npm:@types/express@4"
import express, { Request, Response } from "npm:express@4.18.2";
// import { Request, Response } from 'npm:@types/express@4.17.17';

const app = express();

app.get("/", function (_req: Request, res: Response) {
    // _req.url
    res.send(message("hello") + bbb());
});

app.listen(3000, () => {
    console.log("Express listening on :3000");
});



