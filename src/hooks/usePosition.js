export const useOffsetTop = (ele) => {
  let offsetTop = ele.offsetTop;
  while (ele = ele.offsetParent) {
    offsetTop += ele.offsetTop;
  }
  return offsetTop;
};

export const useOffsetLeft = (ele) => {
  let offsetLeft = ele.offsetLeft;
  while (ele = ele.offsetParent) {
    offsetLeft += ele.offsetLeft;
  }
  return offsetLeft;
};