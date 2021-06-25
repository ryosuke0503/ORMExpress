import "reflect-metadata";
import { createConnection, useContainer, createQueryBuilder, getConnection} from "typeorm";
import { createExpressServer } from "routing-controllers";
import { UserController } from "./controller/UserController";
import { MatchController } from "./controller/MatchController";
import { TeamController } from "./controller/TeamController";
import {User} from "./entity/User";
import {Team} from "./entity/Team";
import {Match} from "./entity/Match";

import * as express from "express";


createConnection()
  .then(async (connection) => {
    console.log("Connected. ");

    const ap = createExpressServer({
      controllers: [UserController, TeamController, MatchController],
    });

    ap.listen(3000);

    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(User)
    .where("id = :id", { id: 4 })
    .execute();
 
    console.log(createQueryBuilder()
    .delete()
    .from(User)
    .where("id = :id", { id: 4 })
    .getSql())

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/users to see results"
    );
  })
  .catch((error) => console.log(error));