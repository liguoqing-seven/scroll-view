<template>
  <div
    class="seven--scroll-bar-container"
    ref="scrollBarContainer"
  >
    <div
      class="seven--scroll-bar"
      :class="{[scrollbarClass]: true,
        'seven--scroll-bar-x': type === 'x',
        'seven--scroll-bar-y': type === 'y'
      }"
      ref="scrollBar"
      @mousedown="startScroll"
    >
      <slot name="scroll" />
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { useOffsetTop, useOffsetLeft } from '../hooks/usePosition.js';
export default defineComponent({
  name: 'ScrollBar',
  setup(props, context) {
    // scrollBarContainer DOM
    const scrollBarContainer = ref(null);
    // scrollBar DOM
    const scrollBar = ref(null);
    // 监听滚动事件，更新滚动条位置
    watch(props, (newProps) => {
      if (props.type === 'y') {
        scrollBar.value.style.top = newProps.top + 'px';
      }
      if (props.type === 'x') {
        scrollBar.value.style.left = newProps.left + 'px';
      }
    });
    // 竖直滚动条距离页面顶部的距离
    let offsetTop = 0;
    // 水平滚动条距离页面左端的距离
    let offsetLeft = 0;
    onMounted(() => {
      if (props.type === 'y') {
        offsetTop = useOffsetTop(scrollBar.value);
      } else if(props.type === 'x') {
        offsetLeft = useOffsetLeft(scrollBar.value);
      }
    });
    // 保存鼠标移动事件
    let memory = null;
    // 鼠标按下时准备滑动
    const startScroll = e => {
      if (props.type === 'y') {
        const relativeY = e.clientY - offsetTop - props.top;
        document.addEventListener('mousemove', (memory = move(relativeY)));
      } else if (props.type === 'x') {
        const relativeX = e.clientX - offsetLeft - props.left;
        document.addEventListener('mousemove', (memory = move(relativeX)));
      }
    };
    // 鼠标滑动时触发的事件
    const move = (relative) => {
      return (e) => {
        if (props.type === 'y') {
          const top = e.clientY - relative - offsetTop;
          context.emit('pull', top);
        } else if (props.type === 'x') {
          const left = e.clientX - relative - offsetLeft;
          context.emit('pull', left);
        }
      };
    };
    // 鼠标抬起时停止滑动
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', memory);
      // 通知父元素停止了滑动，active 模式下可以隐藏滚动条了
      context.emit('stopPull');
    });

    return {
      scrollBar,
      startScroll,
      scrollBarContainer
    };
  },
  props: {
    scrollbarClass: String,
    type: { type: String, default: 'y' },
    top: Number,
    left: Number
  }
});
</script>

<style>
.seven--scroll-bar-container {
  flex-shrink: 0;
}
.seven--scroll-bar-y {
  width: 8px;
  height: 40px;
  right: 0;
  top: 0;
}

.seven--scroll-bar-x {
  width: 40px;
  height: 8px;
  bottom: 0;
  left: 0;
}
.seven--scroll-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: #999999;
  position: absolute;
}
.seven--scroll-bar * {
  -webkit-user-drag: none;
}
</style>