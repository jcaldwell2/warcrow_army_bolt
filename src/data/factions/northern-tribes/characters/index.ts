
import { Unit } from "../../../../types/army";
import { northernTribesLeaders } from "./leaders";
import { northernTribesSupports } from "./supports";
import { northernTribesElites } from "./elites";
import { northernTribesSpecialists } from "./specialists";

export const northernTribesCharacters: Unit[] = [
  ...northernTribesLeaders,
  ...northernTribesSupports,
  ...northernTribesElites,
  ...northernTribesSpecialists
];
