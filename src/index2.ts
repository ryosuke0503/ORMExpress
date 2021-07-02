import "reflect-metadata";
import { createConnection, useContainer, createQueryBuilder, getConnection, Connection, ConnectionOptions } from "typeorm";
import { createExpressServer } from "routing-controllers";
import { UserController } from "./controller/UserController";
import { MatchController } from "./controller/MatchController";
import { TeamController } from "./controller/TeamController";
import {User} from "./entity/User";
import {Team} from "./entity/Team";
import {Match} from "./entity/Match";


const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const multer = require('multer')
const fs = require('fs')
const readline = require('readline');
const upload = multer({ dest: 'uploads/' })

const app = express();

createConnection()
  .then(async (connection) => {
    //console.log(connection)
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.urlencoded({ extended: false }));

    app.listen(3000, () => { 
      console.log("Server started (http://localhost:3000/) !");
    });

    app.get("/", (req, res) => { 
      res.render("index");
    });
    app.get("/about", (req, res) => {
        res.render("about");
    });
    app.get("/data", (req, res) => {
        const test = {
          title: "Test",
          items: ["one", "two", "three"]
        };
        res.render("data", { model: test });
    });
    app.get("/teams", async (req, res) => {
        const rows = await connection
            .createQueryBuilder()
            .from(Team, 'teams')
            .execute()
        res.render("teams", { model: rows });

    });
    app.get("/matches", async (req, res) => {
        const rows = await createQueryBuilder()
        .from(Match, 'matches')
        .execute();
        res.render("matches", { model: rows });
    });
    app.get("/teamedit/:id", async (req, res) => {
         const row = await getConnection()
        .createQueryBuilder()
        .from(Team, 'teams')
        .where('id = :id', {id: req.params.id})
        .execute();
        res.render("teamedit", { model: row[0] });
    });
    app.post("/teamedit/:id", (req, res) => {
        createQueryBuilder()
        .update(Team)
        .set({name: req.body.name})
        .where('id = :id', {id: req.params.id})
        .execute();
        res.redirect("/teams");
    });
    app.get("/matchedit/:id", async (req, res) => {
         const row = await getConnection()
        .createQueryBuilder()
        .from(Match, 'matches')
        .where('id = :id', {id: req.params.id})
        .execute();
        console.log(row)
        res.render("matchedit", { model: row[0] });
    });
    app.post("/matchedit/:id", (req, res) => {
        createQueryBuilder()
        .update(Match)
        .set({year: req.body.year, league: req.body.league, kind: req.body.kind, date: req.body.date,
              time: req.body.time, home: req.body.home, homescore: req.body.homescore, awayscore: req.body.awayscore, 
              away: req.body.away, stadium: req.body.stadium, viewers: req.body.viewers, broadcasts: req.body.broadcasts})
        .where('id = :id', {id: req.params.id})
        .execute();
        res.redirect("/matches");
    });
    app.get("/teamcreate", (req, res) => {
        const team = {
          name: " "
        }
        res.render("teamcreate", { model: team });
    });
    app.post("/teamcreate", (req, res) => {
        createQueryBuilder()
        .insert()
        .into(Team)
        .values({name: req.body.name})
        .execute();
        res.redirect("/teams");
    });
    app.get("/matchcreate", (req, res) => {
      //const match = {year: 0, league: '', kind: '', date: '', time: '', home: 0,
      //              homescore: 0, awayscore: 0, away: 0, stadium: '', viewers: 0, broadcasts: ''}
      const match = {}
      res.render("matchcreate", { model: match });
    });
    app.post("/matchcreate", async (req, res) => {
        //console.log(
        createQueryBuilder()
        .insert()
        .into(Match)
        .values([{year: req.body.year, league: req.body.league, kind: req.body.kind, date: req.body.date,
                time: req.body.time, home: req.body.home, homescore: req.body.homescore, awayscore: req.body.awayscore,
                away: req.body.away, stadium: req.body.stadium, viewers: req.body.viewers, broadcasts: req.body.broadcasts}])
        .execute()
        res.redirect("/matches");
    });
    app.get("/teamdelete/:id", async (req, res) => {
         const row = await getConnection()
        .createQueryBuilder()
        .from(Team, 'teams')
        .where("id = :id", { id: req.params.id })
        .execute();
        res.render("teamdelete", { model: row[0] }); 
    });
    app.post("/teamdelete/:id", async (req, res) => {
        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Team)
        .where("id = :id", { id: req.params.id })
        .execute(); 
        res.redirect("/teams") 
    });
    app.get("/matchdelete/:id", async (req, res) => {
         const row = await createQueryBuilder()
        .from(Match, 'matches')
        .where("id = :id", { id: req.params.id })
        .execute();
        res.render("matchdelete", { model: row[0] }); 
    });
    app.post("/matchdelete/:id", (req, res) => {
        createQueryBuilder()
        .delete()
        .from(Match)
        .where("id = :id", { id: req.params.id })
        .execute();
        res.redirect("/matches") 
    });

    app.get("/teamshow/:id", async (req, res) => {
      const row = await getConnection()
      .createQueryBuilder()
      .from(Team, 'teams')
      .where("id = :id", { id: req.params.id })
      .execute();
      console.log(row[0]);

      const id = req.params.id;
      var details = {matches:0, wins:0, loses:0, draws:0, gpoints:0, lpoints:0};

      var sql = "COUNT(home = "+row[0].id+" or NULL)"
      var tmp = await createQueryBuilder()
      .select(sql)
      .from(Match, 'matches')
      .execute()
      details.matches += tmp[0][sql];
      sql = "COUNT(away = "+row[0].id+" or NULL)"
      tmp = await createQueryBuilder()
            .select(sql)
            .from(Match, 'matches')
            .execute()
      details.matches += tmp[0][sql];
      sql = "COUNT((home = "+row[0].id+" or NULL) and (homescore > awayscore or NULL))"
      tmp = await createQueryBuilder()
            .select(sql)
            .from(Match, 'matches')
            .execute()
      details.wins += tmp[0][sql];
      sql = "COUNT((away = "+row[0].id+" or NULL) and (homescore < awayscore or NULL))"
      tmp = await createQueryBuilder()
            .select(sql)
            .from(Match, 'matches')
            .execute()
      details.wins += tmp[0][sql];
      sql = "COUNT((home = "+row[0].id+" or NULL) and (homescore < awayscore or NULL))"
      tmp = await createQueryBuilder()
            .select(sql)
            .from(Match, 'matches')
            .execute()
      details.loses += tmp[0][sql];
      sql = "COUNT((away = "+row[0].id+" or NULL) and (homescore > awayscore or NULL))"
      tmp = await createQueryBuilder()
            .select(sql)
            .from(Match, 'matches')
            .execute()
      details.loses += tmp[0][sql];
      sql = "COUNT((home = "+row[0].id+" or away = "+row[0].id+" or NULL) and (homescore = awayscore or NULL))"
      tmp = await createQueryBuilder()
            .select(sql)
            .from(Match, 'matches')
            .execute()
      details.draws += tmp[0][sql];
    
      sql = "matches.home = "+row[0].id
      tmp = await createQueryBuilder()
      .select('SUM(homescore)')
      .from(Match, 'matches')
      .where(sql)
      .execute()
      details.gpoints += tmp[0]['SUM(homescore)'];

      tmp = await createQueryBuilder()
      .select('SUM(awayscore)')
      .from(Match, 'matches')
      .where(sql)
      .execute()
      details.lpoints += tmp[0]['SUM(awayscore)'];

      sql = "matches.away = "+row[0].id
      tmp = await createQueryBuilder()
      .select('SUM(awayscore)')
      .from(Match, 'matches')
      .where(sql)
      .execute()
      details.gpoints += tmp[0]['SUM(awayscore)'];

      tmp = await createQueryBuilder()
      .select('SUM(homescore)')
      .from(Match, 'matches')
      .where(sql)
      .execute()
      details.lpoints += tmp[0]['SUM(homescore)'];

      console.log(details)
      row[0] = Object.assign(row[0], details)
      res.render("teamshow", { model: row[0] });
    });
    app.post("/teamshow/:id", async (req, res) => {
      res.redirect("/teams");
    });
    app.post('/teamupload', upload.single('upName'), (req, res) => {
      console.log(`originalname: ${req.file.originalname}`)
      console.log(`path: ${req.file.path}`)
    
      const rs = fs.createReadStream(req.file.path);
      const rl = readline.createInterface({input: rs, });
      var sql = "";
      rl.on('line', async (linestring)=>{
        await createQueryBuilder()
        .insert()
        .into(Team)
        .values([
          {name: linestring}
        ])
        .execute()
      })
    
      res.redirect("/teams");
    })

    app.post('/matchupload', upload.single('upName'), (req, res) => {
      console.log(`originalname: ${req.file.originalname}`)
      console.log(`path: ${req.file.path}`)
    
      const rs = fs.createReadStream(req.file.path);
      const rl = readline.createInterface({input: rs, });
      var sql = "";
      rl.on('line', async (linestring)=>{
        var arr = linestring.split(',');
        //console.log(arr)
        await createQueryBuilder()
        .insert()
        .into(Match)
        .values({
            year: arr[0],
            league: arr[1],
            kind: arr[2],
            date: arr[3],
            time: arr[4],
            home: arr[5],
            homescore: arr[6],
            awayscore: arr[7],
            away: arr[8],
            stadium: arr[9],
            viewers: arr[10],
            broadcasts: arr[11]
          })
        .execute()
      })
      res.redirect("/matches");
    })
    
  })
.catch((error) => console.log(error));