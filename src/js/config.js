import dotenv from "dotenv";
dotenv.config();

export const API_URL = "https://forkify-api.herokuapp.com/api/v2/recipes";
export const TIMEOUT_SEC = 10;
export const RECIPES_PER_PAGE = 10;
export const KEY = process.env.API_KEY;
export const MODAL_CLOSE_SEC = 2.5;
