import z from "zod";
import { searchTerm } from "./utility.validation";

const searchSchema = z.object({
    searchTerm: searchTerm
});


export { searchSchema }