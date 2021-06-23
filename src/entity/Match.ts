import {
    Entity, Column, PrimaryGeneratedColumn,
    BaseEntity, CreateDateColumn, UpdateDateColumn,
    ManyToOne, JoinColumn, ManyToMany
  } from 'typeorm'
import { Team } from '../entity/Team'

@Entity('matches')
export class Match extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    year: number;
    @Column()
    league: string;
    @Column()
    kind: string;
    @Column()
    data: string;
    @Column()
    time: string;
    @Column()
    home_id: number;
    @Column()
    homescore: number;
    @Column()
    awayscore: number;
    @Column()
    away_id: number;
    @Column()
    stadium: string;
    @Column()
    viewers: number;
    @Column()
    broadcasts: string;

    /*
    @ManyToMany(type => Team, team => team.matches, { nullable: true })
    teams?: Team[]
    */
}
