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
  import { Team } from "../entity/Team";
  import { getRepository, Repository } from "typeorm";
  import { EntityFromParam } from "typeorm-routing-controllers-extensions";
  
  @JsonController()
  export class TeamController {
    teamRepository: Repository<Team> = getRepository(Team);
  
    @Get("/teams")
    getAll() {
      return this.teamRepository.find();
    }
  
    @Get("/teams/:id")
    async getOne(@EntityFromParam("id") team: Team) {
      if (!team) {
        throw new NotFoundError("Team was not found !");
      }
      return team;
    }
  
    @Post("/teams")
    async post(@Body() team: any) {
      return await this.teamRepository.save(team);
    }
  
    @Put("/teams/:id")
    async put(@Param("id") id: number, @Body() team: any) {
      return await this.teamRepository.update(id, team);
    }
  
    @Delete("/teams/:id")
    async remove(@EntityFromParam("id") team: Team) {
      if (!team) {
        throw new NotFoundError("Team was not found !");
      }
      return await this.teamRepository.remove(team);
    }
  }