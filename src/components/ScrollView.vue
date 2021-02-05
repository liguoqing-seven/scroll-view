<template>
  <section
    class="seven-scroll-container"
    :style="{
      width: initData(width),
      height: initData(height)
    }"
    @mouseenter="showScrollBar"
    @mouseleave="hiddenScrollBar"
  >
    <!-- 滚动的容器 -->
    <div
      class="seven--scroll-view"
      :style="initStyle"
      @scroll="scroll"
      ref="scrollView"
    >
      <slot />
    </div>
    <!-- 竖直滚动条 -->
    <ScrollBar
      v-if="scrollY && canYScroll"
      type="y"
      :scrollbar-class="scrollbarClass"
      ref="yScroll"
      :top="top"
      @pull="pullY"
      :class="{ hidden: active && (!barIsShow && !isYPulling) }"
      @stopPull="stopPull"
    >
      <template #scroll>
        <slot name="scroll" />
      </template>
    </ScrollBar>
    <!-- 水平滚动条 -->
    <ScrollBar
      v-if="scrollX && canXScroll"
      type="x"
      :scrollbar-class="scrollbarClass"
      ref="xScroll"
      :left="left"
      @pull="pullX"
      :class="{ hidden: active && (!barIsShow && !isXPulling) }"
      @stopPull="stopPull"
    >
      <template #scroll>
        <slot name="scroll" />
      </template>
    </ScrollBar>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import ScrollBar from './ScrollBar.vue';

export default defineComponent({
  name: 'ScrollView',
  setup(props, context) {
    const initData = (data) => {
      return parseInt(String(data)) + 'px';
    };
    // 初始化样式
    const initStyle = {
      overflowX: props.scrollX ? 'scroll' : 'visible',
      overflowY: props.scrollY ? 'scroll' : 'visible',
    };
    // 容器 DOM
    const scrollView = ref(null);
    let scrollViewAllWidth = ref(0); // 滚动容器的总宽度
    let scrollViewAllHeight = ref(0); // 滚动容器总高度
    let scrollViewWidth = 0; // 滚动容器的可视宽度
    let scrollViewHeight = 0; // 滚动容器的可视高度
    let scrollBarHeight = 0; // 竖直滚动条的高度
    let scrollBarWidth = 0; // 水平滚动条的宽度
    const yScroll = ref(null);
    const xScroll = ref(null);
    // 竖直滚动条的 top 属性的值
    const top = ref(0);
    // 水平滚动条的 left 属性的值
    const left = ref(0);
    onMounted(() => {
      // 获取元素的宽高信息
      scrollViewAllWidth.value = scrollView.value.scrollWidth;
      scrollViewAllHeight.value = scrollView.value.scrollHeight;
      scrollViewWidth = scrollView.value.offsetWidth;
      scrollViewHeight = scrollView.value.offsetHeight;
      scrollBarHeight = yScroll.value ? yScroll.value.scrollBar.offsetHeight : 0;
      scrollBarWidth = xScroll.value ? xScroll.value.scrollBar.offsetWidth : 0;
      // 根据用户传递的 scrollTop 和 scrollLeft
      top.value = parseInt(String(props.scrollTop));
      left.value = parseInt(String(props.scrollLeft));
    });
    watch(top, (newTop) => {
      scrollView.value.scrollTop = (scrollViewAllHeight.value - scrollViewHeight) * newTop / (scrollViewHeight - scrollBarHeight);
    });
    watch(left, (newLeft) => {
      scrollView.value.scrollLeft = (scrollViewAllWidth.value - scrollViewWidth) * newLeft / (scrollViewWidth - scrollBarWidth);
    });
    const canXScroll = ref(true);
    const canYScroll = ref(true);
    // 监听内部总宽高，看是否有必要滚动
    watch(scrollViewAllWidth, () => {
      if (scrollViewAllWidth.value <= scrollViewWidth) {
        canXScroll.value = false;
      }
    });
    watch(scrollViewAllHeight, () => {
      if (scrollViewAllHeight.value <= scrollViewHeight) {
        canYScroll.value = false;
      }
    });
    // 滚动时触发
    const scroll = e => {
      // 滚动的时候可能会一步加载数据而改变容器内的总高度
      scrollViewAllWidth.value = scrollView.value.scrollWidth;
      scrollViewAllHeight.value = scrollView.value.scrollHeight;
      // 设置 left 和 top 值
      left.value = e.target.scrollLeft * (scrollViewWidth - scrollBarWidth) / (scrollViewAllWidth.value - scrollViewWidth);
      top.value = e.target.scrollTop * (scrollViewHeight - scrollBarHeight) / (scrollViewAllHeight.value - scrollViewHeight);
      context.emit('scroll', e, scrollViewAllHeight.value - scrollViewHeight - e.target.scrollTop, scrollViewAllWidth.value - scrollViewWidth - e.target.scrollLeft);
    };
    // 拖拽竖直滚动条时触发
    const pullY = (newTop) => {
      const min = 0;
      const max = scrollViewHeight - scrollBarHeight;
      if (newTop <= min) {
        newTop = min;
      } else if (newTop >= max) {
        newTop = max;
      }
      top.value = newTop;
      isYPulling.value = true;
    };
    // 拖拽水平滚动条时触发
    const pullX = (newLeft) => {
      const min = 0;
      const max = scrollViewWidth - scrollBarWidth;
      if (newLeft <= min) {
        newLeft = min;
      } else if (newLeft >= max) {
        newLeft = max;
      }
      left.value = newLeft;
      isXPulling.value = true;
    };
    // 鼠标是否在容器中
    const barIsShow = ref(false);
    // 是否在使用鼠标拖拽滚动条滚动
    const isYPulling = ref(false);
    const isXPulling = ref(false);
    // 当用户选择 active 模式后，进入容器后显示滚动条
    const showScrollBar = () => {
      barIsShow.value = true;
    };
    // active 模式下，鼠标离开容器隐藏滚动条
    const hiddenScrollBar = () => {
      barIsShow.value = false;
    };
    const stopPull = () => {
      isYPulling.value = false;
      isXPulling.value = false;
    };

    return {
      initData,
      initStyle,
      scroll,
      scrollView,
      yScroll,
      xScroll,
      top,
      left,
      pullY,
      pullX,
      showScrollBar,
      barIsShow,
      hiddenScrollBar,
      isXPulling,
      isYPulling,
      stopPull,
      canXScroll,
      canYScroll
    };
  },
  props: {
    width: { type: [String, Number], default: '400px' },
    height: { type: [String, Number], default: '200px' },
    scrollX: { type: Boolean, default: false },
    scrollY: { type: Boolean, default: false },
    scrollTop: { type: [Number, String], default: '0' },
    scrollLeft: { type: [Number, String], default: '0' },
    scrollbarClass: { type: String, default: '' },
    active: { type: Boolean, default: false }
  },
  components: {
    ScrollBar
  }
});
</script>

<style>
.seven-scroll-container {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.seven-scroll-container * {
  box-sizing: border-box;
}
.seven--scroll-view {
  flex: 1;
}
::-webkit-scrollbar {
  display: none;
}
.active {
 display: none;
}
.hidden {
  opacity: 0;
}
</style>