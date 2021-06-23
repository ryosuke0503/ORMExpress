import {
    Entity, Column, PrimaryGeneratedColumn,
    BaseEntity, CreateDateColumn, UpdateDateColumn,
    ManyToOne, JoinColumn, ManyToMany, JoinTable
  } from 'typeorm'
  import { Match } from '../entity/Match'

@Entity('teams')
export class Team extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    Name: string;

    /*
    @ManyToMany(type => Match, match => match.teams)
    @JoinTable({
      name: 'team_matches',
      joinColumns: [{ name: "home_id", referencedColumnName: "id" }, { name: 'away_id', referencedColumnName: 'id' }],
      inverseJoinColumns: [{ name: 'match_id', referencedColumnName: 'id' }]
    })
    matches?: Match[]
    */

  }