<template>
  <div style="height: calc(100vh - 58px); overflow: hidden">
    <a-layout class="layout-demo">
      <a-layout-sider collapsible>
        <!-- <div class="logo"></div> -->
        <a-menu
          :default-open-keys="['1']"
          :default-selected-keys="['0']"
          :style="{ width: '100%', fontSize: '16px' }"
          @menu-item-click="onClickMenuItem"
        >
          <div class="menu" v-for="(_, index) in menuList" :key="index">
            <a-menu-item :key="_.id">
              <!-- <template #icon><IconApps></IconApps></template> -->
              {{ _.name }}</a-menu-item
            >
          </div>
        </a-menu>
        <!-- trigger -->
        <template #trigger="{ collapsed }">
          <IconCaretRight v-if="collapsed"></IconCaretRight>
          <IconCaretLeft v-else></IconCaretLeft>
        </template>
      </a-layout-sider>
      <a-layout>
        <!-- <a-layout-header style="padding-left: 20px"> Header </a-layout-header> -->
        <a-layout
          :style="{
            'max-height': '80vh',
            padding: '0 24px'
          }"
        >
          <div class="flex justify-between items-center">
            <a-breadcrumb :style="{ margin: '16px 0' }">
              <a-breadcrumb-item>{{ currentModel }}</a-breadcrumb-item>
              <a-breadcrumb-item>部署实例</a-breadcrumb-item>
              <!-- <a-breadcrumb-item>App</a-breadcrumb-item> -->
            </a-breadcrumb>
            <div class="search-box pr-4">
              <a-input-search
                v-model="filterText"
                :style="{ width: '260px' }"
                placeholder="Please enter something"
                :loading="false"
                allow-clear
              />
            </div>
          </div>
          <a-layout-content>
            <!-- <a-card :bordered="false" :style="{ width: '100%' }"> -->
            <a-scrollbar
              type="track"
              :style="{ height: 'calc(100vh - 150px)', overflow: 'auto' }"
            >
              <a-spin :size="40" :loading="insLoading" tip="Loading...">
                <div class="card-grid-style" v-if="instanceList.length > 0">
                  <div class="card-layout" id="basic-demo">
                    <div
                      class="card"
                      v-for="(_, index) in instanceList"
                      :key="index"
                      @click="handleClick(_.key, _.url)"
                    >
                      <div class="card__subtitle" v-if="filterText === ''">
                        {{ _.name }}
                      </div>
                      <div
                        class="card__subtitle"
                        v-else
                        v-html="
                          _.name.replace(
                            new RegExp(filterText, 'g'),
                            `<font style='color:red;'>${filterText}</font>`
                          )
                        "
                      ></div>
                      <div class="card__subtitle2">{{ _.key }}</div>
                      <div class="card__wrapper">
                        <div class="card__title">New Tab Open</div>
                        <div class="card__icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 256 256"
                            style="
                              user-select: none;
                              width: 100%;
                              height: 100%;
                              display: inline-block;
                              fill: rgb(224, 223, 220);
                              flex-shrink: 0;
                              cursor: auto;
                            "
                            color="rgb(224, 223, 220)"
                          >
                            <g color="rgb(224, 223, 220)">
                              <circle
                                cx="128"
                                cy="128"
                                r="96"
                                opacity="0.2"
                              ></circle>
                              <circle
                                cx="128"
                                cy="128"
                                r="96"
                                fill="none"
                                stroke="rgb(224, 223, 220)"
                                stroke-miterlimit="10"
                                stroke-width="16"
                              ></circle>
                              <polyline
                                points="134.1 161.9 168 128 134.1 94.1"
                                fill="none"
                                stroke="rgb(224, 223, 220)"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="16"
                              ></polyline>
                              <line
                                x1="88"
                                y1="128"
                                x2="168"
                                y2="128"
                                fill="none"
                                stroke="rgb(224, 223, 220)"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="16"
                              ></line>
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="emply-box"
                  :style="{
                    width: 'calc(100vw - ' + menuWidth + 'px)'
                  }"
                >
                  <a-empty />
                </div>
              </a-spin>
            </a-scrollbar>
            <!-- </a-card> -->
          </a-layout-content>
          <!-- <a-layout-footer>Footer</a-layout-footer> -->
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>
<script setup>
import service from '@/api/request'
import { Notification } from '@arco-design/web-vue'
import { useLoadConfig } from '@/hooks/useLoadConfig'
import {
  IconCaretRight,
  IconCaretLeft,
  IconRefresh,
  IconApps
} from '@arco-design/web-vue/es/icon'

// import logoSrc from '@/assets/logo.png'

// let title: string = import.meta.env.VITE_APP_TITLE
let currentModel = ref('产品型号')
let menuWidth = ref(300)
let filterText = ref('')

// 加载配置方法
useLoadConfig()

let menuList = ref([])
let instanceList = ref([])
const queryDataSet = (isIns, value) => {
  let data = {
    pageDataGrpID: isIns
      ? 'queryProductInstancesList'
      : 'queryProductModelList',
    product: isIns ? value : '',
    pageID: 'secretLoginPage',
    productName: '软件开发解决方案',
    keySvrName: 'authenticationServer'
  }
  service.post('/queryDataSet', data).then(response => {
    console.log('查询产品列表/部署实例', response)
    if (isIns) {
      switchInsList(response.data.queryProductInstancesList)
    } else {
      let isFrist = value === 'frist' ? true : false
      switchModelList(response.data.queryProductModelList, isFrist)
    }
  })
}

const switchModelList = (origin, isFrist) => {
  menuList.value = []
  origin.forEach((item, index) => {
    menuList.value.push({
      id: index + '',
      key: item.instance,
      name: item.instance
    })
  })
  console.log('menuList', menuList.value)
  if (isFrist) {
    queryDataSet(true, menuList.value[0].key)
    currentModel.value = menuList.value[0].key
  }
  return menuList.value
}
const switchInsList = origin => {
  instanceList.value = []
  origin.forEach((item, index) => {
    instanceList.value.push({
      id: index + '',
      key: item.instance,
      name: item.showName,
      url: item.url
    })
  })
  console.log('instanceList', instanceList.value)
  setTimeout(() => {
    insLoading.value = false
  }, 500)
}
queryDataSet(false, 'frist')

// type MenuItem = {
//   id: string;
//   key: string;
//   name: string;
//   icon?: string;
//   children?: MenuItem[];
// };

let insLoading = ref(false)
const onClickMenuItem = key => {
  let name = menuList.value[key].key
  console.log('name', name)
  currentModel.value = name
  // 加载动画
  insLoading.value = true
  // 发送请求加载右侧实例
  queryDataSet(true, name)
}

const handleClick = (key, url) => {
  if (url) {
    window.open(url)
  } else {
    // 拼接url
    const outside = window.getMetaConfig().outside
    const url = `${outside}?keySvrName=${key}`
    // 新标签页打开
    window.open(url)
  }
}
</script>

<style scoped lang="less">
.layout-demo {
  height: 100%;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border);
}
.layout-demo :deep(.arco-layout-sider) {
  width: auto !important;
}
.layout-demo :deep(.arco-layout-sider-trigger) {
  width: auto !important;
}

.layout-demo :deep(.arco-layout-sider) .logo {
  height: 32px;
  margin: 12px 8px;
  background: rgba(255, 255, 255, 0.2);
}
.layout-demo :deep(.arco-layout-sider-light) .logo {
  background: var(--color-fill-2);
}
.layout-header :deep(.arco-layout-header) {
  height: 64px;
  line-height: 64px;
  background: var(--color-bg-3);
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.layout-demo :deep(.arco-layout-footer) {
  height: 48px;
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  line-height: 48px;
}
.layout-demo :deep(.arco-layout-content) {
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  background: var(--color-bg-3);
}
.layout-demo :deep(.arco-layout-footer),
.layout-demo :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: start;
  color: var(--color-white);
  font-size: 16px;
  font-stretch: condensed;
  // text-align: center;
}
.card-demo {
  transition-property: all;
}
.card-demo:hover {
  transform: translateY(-8px);
}
.card-grid-style {
  min-height: calc(100vh - 64px - 60px);
}
.emply-box {
  height: calc(100vh - 64px - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-layout {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .card {
    --main-color: #323232;
    --sub-color: #5b5b5b;
    --sub-color2: #5b5b5bc2;
    --bg-color: rgba(199, 199, 199, 0.8);
    --accent-color: #242c88;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    width: 280px;
    margin: 15px;
    padding: 20px 25px 5px;
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    background-color: var(--bg-color);
    transition: all 0.2s;
    cursor: pointer;
    box-shadow: 0px 0px 5px -1.5px #000;
  }

  // .card::before {
  //   content: '';
  //   width: 99%;
  //   height: 99%;
  //   background: var(--sub-color);
  //   position: absolute;
  //   z-index: -1;
  //   top: 1px;
  //   left: 1px;
  //   border-radius: 25px;
  //   transition: all 0.3s;
  // }

  .card__wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .card__img {
    width: 100%;
  }

  .card__title {
    color: var(--main-color);
    font-weight: 700;
    font-size: 14px;
  }

  .card__subtitle {
    color: var(--sub-color);
    font-weight: 600;
    font-size: 16px;
    height: 40px;
  }
  .card__subtitle2 {
    color: var(--sub-color2);
    font-weight: 600;
    font-size: 15px;
    height: 25px;
  }

  .card__icon {
    width: 40px;
    height: 40px;
    transform: rotate(-45deg);
    transition: all 0.3s;
  }

  .card__icon svg {
    width: 100%;
    height: 100%;
  }

  .card__icon g {
    fill: var(--main-color);
  }

  .card__icon circle,
  polyline,
  line {
    stroke: var(--main-color);
  }

  .card:hover .card__icon {
    transform: rotate(0);
  }

  .card:hover .card__icon circle,
  .card:hover .card__icon polyline,
  .card:hover .card__icon line {
    stroke: var(--accent-color);
  }

  .card:hover .card__icon g {
    fill: var(--accent-color);
  }

  .card:hover {
    box-shadow: 0px 0px 20px -5px #000;
    transform: rotate(0deg);
  }

  .card:hover::before {
    // transform: rotate(10deg);
    box-shadow: 0px 0px 20px -5px #000;
  }

  /* remove svg from class ="card__img" and last styles below css code before use */
  .st1 {
    fill: #fff;
  }

  .st2 {
    fill: none;
    stroke: #242c88;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 10;
  }

  .st7 {
    fill: #589fff;
  }

  .st9 {
    fill: #bc8d66;
  }

  .st15,
  .st16 {
    opacity: 0.4;
    fill: #242c88;
  }

  .st16 {
    opacity: 0.2;
  }

  .st18 {
    fill: #ffc408;
  }

  .st53 {
    fill: none;
    stroke: #242c88;
    stroke-width: 1.848;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-miterlimit: 10;
  }
}

/* 3D tower loader made by: csozi | Website: www.csozi.hu*/

.loader {
  scale: 3;
  height: 50px;
  width: 40px;
}

.box {
  position: relative;
  opacity: 0;
  left: 10px;
}

.side-left {
  position: absolute;
  background-color: #286cb5;
  width: 19px;
  height: 5px;
  transform: skew(0deg, -25deg);
  top: 14px;
  left: 10px;
}

.side-right {
  position: absolute;
  background-color: #2f85e0;
  width: 19px;
  height: 5px;
  transform: skew(0deg, 25deg);
  top: 14px;
  left: -9px;
}

.side-top {
  position: absolute;
  background-color: #5fa8f5;
  width: 20px;
  height: 20px;
  rotate: 45deg;
  transform: skew(-20deg, -20deg);
}

.box-1 {
  animation: from-left 4s infinite;
}

.box-2 {
  animation: from-right 4s infinite;
  animation-delay: 1s;
}

.box-3 {
  animation: from-left 4s infinite;
  animation-delay: 2s;
}

.box-4 {
  animation: from-right 4s infinite;
  animation-delay: 3s;
}

@keyframes from-left {
  0% {
    z-index: 20;
    opacity: 0;
    translate: -20px -6px;
  }

  20% {
    z-index: 10;
    opacity: 1;
    translate: 0px 0px;
  }

  40% {
    z-index: 9;
    translate: 0px 4px;
  }

  60% {
    z-index: 8;
    translate: 0px 8px;
  }

  80% {
    z-index: 7;
    opacity: 1;
    translate: 0px 12px;
  }

  100% {
    z-index: 5;
    translate: 0px 30px;
    opacity: 0;
  }
}

@keyframes from-right {
  0% {
    z-index: 20;
    opacity: 0;
    translate: 20px -6px;
  }

  20% {
    z-index: 10;
    opacity: 1;
    translate: 0px 0px;
  }

  40% {
    z-index: 9;
    translate: 0px 4px;
  }

  60% {
    z-index: 8;
    translate: 0px 8px;
  }

  80% {
    z-index: 7;
    opacity: 1;
    translate: 0px 12px;
  }

  100% {
    z-index: 5;
    translate: 0px 30px;
    opacity: 0;
  }
}
</style>
