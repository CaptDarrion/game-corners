import UIController from "./controllers/UIController.js";
import GameController from "./controllers/GameController.js";

const ui = new UIController();
new GameController(ui);
