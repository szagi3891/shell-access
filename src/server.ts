import { bbb } from "src/bbb.ts";
import { message } from "./aaa.ts";

// @deno-types="npm:@types/express@4"
import express, { Request, Response } from "npm:express@4.18.2";
// import { Request, Response } from 'npm:@types/express@4.17.17';

const args = Deno.args;
console.info('args', args);

const app = express();

app.get("/", function (_req: Request, res: Response) {
    // _req.url
    res.send(message("hello") + bbb());
});

app.listen(3000, () => {
    console.log("Express listening on :3000");
});



