import {
  DemoStyleObject1,
  DemoStyleObject2,
  DemoStyleObject3
} from "./classes";

document.querySelector("#demo1").classList.add(DemoStyleObject1.class);
document.querySelector("#demo2").classList.add(DemoStyleObject2.class);
document.querySelector("#demo3").classList.add(DemoStyleObject3.class);

const height = 100;
setInterval(
  () => DemoStyleObject1.update({ rules: "height: ${height++}" }),
  100
);
