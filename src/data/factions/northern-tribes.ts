
import { Unit } from "../../types/army";
import { northernTribesTroops } from "./northern-tribes/troops";
import { northernTribesCharacters } from "./northern-tribes/characters";
import { northernTribesHighCommand } from "./northern-tribes/high-command";

export const northernTribesUnits: Unit[] = [
  ...northernTribesTroops,
  ...northernTribesCharacters,
  ...northernTribesHighCommand
];
