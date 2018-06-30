import { MAIN_SHEET_ID, KEYFRAME_SHEET_ID } from "../constants";

const mainSheet = document.createElement("style");
const keyframeSheet = document.createElement("style");

mainSheet.id = MAIN_SHEET_ID;
keyframeSheet.id = KEYFRAME_SHEET_ID;

document.head.appendChild(mainSheet);
document.head.appendChild(keyframeSheet);

export { mainSheet, keyframeSheet };
