import {
    Param,
    Body,
    Get,
    Post,
    Put,
    Delete,
    JsonController,
    NotFoundError,
  } from "routing-controllers";
  import { Match } from "../entity/Match";
  import { getRepository, Repository } from "typeorm";
  import { EntityFromParam } from "typeorm-routing-controllers-extensions";
  
  @JsonController()
  export class MatchController {
    matchRepository: Repository<Match> = getRepository(Match);
  
    @Get("/matches")
    getAll() {
      return this.matchRepository.find();
    }
  
    @Get("/matches/:id")
    async getOne(@EntityFromParam("id") match: Match) {
      if (!match) {
        throw new NotFoundError("Match was not found !");
      }
      return match;
    }
  
    @Post("/matches")
    async post(@Body() match: any) {
      return await this.matchRepository.save(match);
    }
  
    @Put("/matches/:id")
    async put(@Param("id") id: number, @Body() match: any) {
      return await this.matchRepository.update(id, match);
    }
  
    @Delete("/matches/:id")
    async remove(@EntityFromParam("id") match: Match) {
      if (!match) {
        throw new NotFoundError("Match was not found !");
      }
      return await this.matchRepository.remove(match);
    }
  }