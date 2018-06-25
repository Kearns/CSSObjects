import compose from "./utils/compose";
import { MAIN_SHEET_ID, KEYFRAME_SHEET_ID } from "./constants";
import {
  addClassToContainer,
  addScopeToContainer,
  addMediaQueriesToContainer,
  updateClassToContainer
} from "./funcs";

const mainSheet = document.createElement("style");
const keyframeSheet = document.createElement("style");
mainSheet.id = MAIN_SHEET_ID;
keyframeSheet.id = KEYFRAME_SHEET_ID;
document.head.appendChild(mainSheet);
document.head.appendChild(keyframeSheet);

const Container = {
  sheets: [mainSheet, keyframeSheet],
  scopes: [],
  classes: {}
};

Container.pushClass = cssObj =>
  compose(
    addMediaQueriesToContainer(Container),
    addClassToContainer(Container),
    addScopeToContainer(Container)
  )(cssObj);

Container.updateClass = cssObj =>
  compose(updateClassToContainer(Container))(cssObj);

export default Container;
