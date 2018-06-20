import compose from "./utils/compose";
import { MAIN_SHEET_ID } from "./constants";
import {
  addClassToContainer,
  addScopeToContainer,
  addMediaQueriesToContainer,
  updateClassToContainer
} from "./funcs";

const mainSheet = document.createElement("style");
mainSheet.id = MAIN_SHEET_ID;
document.head.appendChild(mainSheet);

const Container = {
  sheets: [mainSheet],
  scopes: [],
  classes: {}
};

Container.pushClassObject = cssObj =>
  compose(
    addMediaQueriesToContainer(Container),
    addClassToContainer(Container),
    addScopeToContainer(Container)
  )(cssObj);

Container.updateClassObject = cssObj =>
  compose(updateClassToContainer(Container))(cssObj);

export default Container;
