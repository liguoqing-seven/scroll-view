## Scroll-View component
A scroll container in which you can customize the scroll bar.

## properties
| 属性名 | 类型 | 默认值 | 说明 |
| --- | :---: | :---: | --- |
| width | Number/String | scroll-view 容器的宽度，横向滚动时必需 |
| height | Number/String | scroll-view 容器的高度，纵向滚动时必需 |
| scroll-x | Boolean | false | 允许横向滚动 |
| scroll-y | Boolean | false | 允许纵向滚动 |
| scroll-top | Number/String |  | 设置竖向滚动条的位置 |
| scroll-left | Number/String |  | 设置横向滚动条的位置 |
| scrollbar-class | String |  | 滚动条的类名 |
| active | Boolean | false | 只有当前容器处于活跃状态时才显示滚动条 |


## events
| 方法名 | 参数 | 说明 |
| --- | :---: | --- |
| scroll |event, y, x| 滚动时触发，event为原生事件对象，y, x 分别为距离下边与右边的距离 |


## slots
| 插槽名 | 说明 |
| --- | --- |
| default | 默认插槽，scroll-view 的主体内容 |
| scroll | 滚动条插槽 |


