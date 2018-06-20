import {
  DemoStyleObject1,
  DemoStyleObject2,
  DemoStyleObject3
} from "./classes";

document.querySelector("#demo1").classList.add(DemoStyleObject1.class);
document.querySelector("#demo2").classList.add(DemoStyleObject2.class);
document.querySelector("#demo3").classList.add(DemoStyleObject3.class);

// var framerate = 50; // In milliseconds (divide by 1000 to get seconds).

// let height = 20;
// let direction = "up";

// var interval = setInterval(() => {
//   if (height >= 50 && direction === "up") direction = "down";
//   if (height <= 20 && direction === "down") direction = "up";
//   height = direction === "up" ? height + 1 : height - 1;
//   DemoStyleObject1.update({
//     rules: [...DemoStyleObject1.rules, `height: ${height}px`]
//   });
//   DemoStyleObject2.update({
//     rules: [`height: ${height}px`]
//   });
// }, 500);
