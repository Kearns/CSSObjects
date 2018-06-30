import compose from "./utils/compose";
import { mainSheet, keyframeSheet } from "./utils/createSheets";
import {
  addClassToContainer,
  addScopeToContainer,
  addMediaQueriesToContainer,
  updateClassToContainer
} from "./funcs";

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
