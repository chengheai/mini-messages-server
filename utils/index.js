// 判断当前时间是否在某个时间段内
function time_range(beginTime, endTime) {
  var strb = beginTime.split(":");
  if (strb.length != 2) {
    return false;
  }
  var stre = endTime.split(":");
  if (stre.length != 2) {
    return false;
  }
  var b = new Date();
  var e = new Date();
  var n = new Date();
  b.setHours(strb[0]);
  b.setMinutes(strb[1]);
  e.setHours(stre[0]);
  e.setMinutes(stre[1]);
  if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
    // console.log(true)
    return true;
  } else {
    // console.log(false)
    return false;
  }
}
/**
 * 随机生成唯一 id
 * @returns string
 */
const generateId = () => {
  return (
    +new Date() +
    Math.random()
      .toString(10)
      .substring(2, 6)
  );
};
/**
 * 生成唯一uuid，可以指定长度和基数
 * @param {number} len 长度，默认36
 * @param {number} radix 基数，如2，8，10，16等
 */
const guid = (len, radix) => {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  let uuid = [];
  let i;
  let j = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * j)];
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
};
module.exports = {
  time_range,
  guid,
  generateId
};
