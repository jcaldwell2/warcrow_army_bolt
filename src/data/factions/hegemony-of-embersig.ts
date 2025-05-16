
import { Unit } from "../../types/army";
import { hegemonyTroops } from "./hegemony/troops";
import { hegemonyCharacters } from "./hegemony/characters";
import { hegemonyHighCommand } from "./hegemony/high-command";

export const hegemonyOfEmbersigUnits: Unit[] = [
  ...hegemonyTroops,
  ...hegemonyCharacters,
  ...hegemonyHighCommand
];
