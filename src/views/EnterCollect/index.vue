<template>
  <div style="height: calc(100vh - 58px); overflow: hidden">
    <a-layout class="layout-demo">
      <a-layout-sider>
        <!-- <div class="logo"></div> -->
        <!-- <a-menu
          :default-open-keys="['1']"
          :default-selected-keys="['0']"
          :style="{ width: '100%', fontSize: '16px' }"
          @menu-item-click="onClickMenuItem"
        >
          <div class="menu" v-for="(_, index) in menuList" :key="index">
            <a-menu-item :key="_.id">
              {{ _.name }}</a-menu-item
            >
          </div>
        </a-menu> -->
        <div class="menuLists">
          <div class="input" v-for="(_, index) in menuList" :key="index">
            <button
              class="value"
              @click="onClickMenuItem(_.id)"
              ref="menuReference"
            >
              {{ _.name }}
            </button>
          </div>
        </div>
        <!-- trigger -->
        <!-- <template #trigger="{ collapsed }">
          <IconCaretRight v-if="collapsed"></IconCaretRight>
          <IconCaretLeft v-else></IconCaretLeft>
        </template> -->
      </a-layout-sider>
      <a-layout>
        <!-- <a-layout-header style="padding-left: 20px"> Header </a-layout-header> -->
        <a-layout
          :style="{
            'max-height': '100vh',
            padding: '24px'
          }"
        >
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
                      class="card-bg1 cursor-pointer rounded-2xl shadow-sm shadow-sky-500 outline outline-slate-400 -outline-offset-8 m-5"
                      v-for="(_, index) in instanceList"
                      :key="index"
                      @click="handleClick(_.name, _.url)"
                    >
                      <div
                        class="card-bg2 group overflow-hidden relative after:duration-500 before:duration-500 duration-500 hover:after:duration-500 hover:after:translate-x-24 hover:before:translate-y-12 hover:before:-translate-x-32 hover:duration-500 after:absolute after:w-24 after:h-24 after:bg-sky-700 after:rounded-full after:blur-xl after:bottom-32 after:right-16 after:w-12 after:h-12 before:absolute before:w-20 before:h-20 before:bg-sky-400 before:rounded-full before:blur-xl before:top-20 before:right-16 before:w-12 before:h-12 hover:rotate-6 flex justify-center items-center h-38 w-66 rounded-2xl outline outline-slate-400 -outline-offset-8"
                      >
                        <div class="z-10 flex flex-col items-center gap-2 p-10">
                          <span class="text-gray-100 text-xl font-bold w-full"
                            >{{ _.name }}
                          </span>
                          <p class="text-gray-300 font-600">{{ _.key }}</p>
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
import { Modal } from '@arco-design/web-vue'
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
let clickMenuName = ref('')
const menuReference = ref(null)
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
  // return menuList.value
}
const switchInsList = origin => {
  changeMenuChecked()

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
const changeMenuChecked = () => {
  let refsList = menuReference.value
  console.log('refsList', refsList)
  if (clickMenuName.value) {
    refsList.forEach(item => {
      if (item.innerText === clickMenuName.value) {
        item.classList.add('checked')
      } else {
        item.classList.remove('checked')
      }
    })
  } else {
    refsList[0].classList.add('checked')
  }
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
  clickMenuName.value = name
  queryDataSet(true, name)
}

const handleClick = (name, url) => {
  console.log({ name, url })
  if (url) {
    window.open(url)
  } else {
    const ModalContent = {
      setup() {
        return () =>
          h('div', { class: 'info-modal-content' }, '未配置', [
            h(
              'span',
              { style: 'color:rgb(var(--red-6));margin: 0 10px' },
              `【${name}】`
            ),
            '的导航地址'
          ])
      }
    }
    Modal.error({
      title: '错误提示',
      content: h(ModalContent)
    })
    // // 拼接url
    // const env = import.meta.env.MODE
    // const outside = window.getMetaConfig(env).outside
    // const url = `${outside}?keySvrName=${key}`
    // // 新标签页打开
    // window.open(url)
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
.layout-demo :deep(.arco-layout-sider-children) {
  margin-top: 20px;
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
  align-items: start !important;
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
  // min-height: calc(100vh - 64px - 60px);
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
  align-items: start;
  .card-bg1 {
    background: rgb(var(--arcoblue-3));
  }
  .card-bg2 {
    background: rgb(var(--arcoblue-5));
  }
}
.menuActive {
  background-color: rgb(var(--arcoblue-6));
  color: var(--color-neutral-1);
  outline: none;
}
.menuLists {
  .input {
    display: flex;
    flex-direction: column;
    width: 300px;
    justify-content: center;
    border-radius: 5px;
    margin: 10px 15px;
  }

  .value {
    // background-color: transparent;
    background-color: var(--color-neutral-3);
    border: none;
    // margin-bottom: 5px;
    padding: 20px;
    font-size: 16px;
    font-weight: 700;
    color: var(--color-neutral-6);
    display: flex;
    position: relative;
    gap: 5px;
    cursor: pointer;
    border-radius: 4px;
  }

  .value:not(:active):hover,
  .value:focus {
    background-color: rgb(var(--arcoblue-3));
    color: var(--color-neutral-1);
  }

  .value:focus,
  .value:active {
    background-color: rgb(var(--arcoblue-5));
    color: var(--color-neutral-1);
    outline: none;
  }

  .checked {
    background-color: rgb(var(--arcoblue-5));
    color: var(--color-neutral-1);
  }

  .value::before {
    content: '';
    position: absolute;
    top: 5px;
    left: -10px;
    width: 5px;
    height: 80%;
    background-color: rgb(var(--green-6));
    border-radius: 5px;
    opacity: 0;
  }
  .checked::before {
    opacity: 1;
  }

  // .value:focus::before,
  // .value:active::before {
  //   opacity: 1;
  // }

  .value svg {
    width: 15px;
  }

  .input:hover > :not(.value:hover) {
    transition: 300ms;
    // filter: blur(1px);
    transform: scale(0.95, 0.95);
  }
}
.parent {
  width: 100%;
  padding: 20px;
  perspective: 1000px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start; //排列格式

  .card {
    padding-top: 10px;
    /* border-radius: 10px; */
    border: 3px solid var(--color-neutral-2);
    transform-style: preserve-3d;
    background: linear-gradient(135deg, #0000 18.75%, #f3f3f3 0 31.25%, #0000 0),
      repeating-linear-gradient(
        45deg,
        #f3f3f3 -6.25% 6.25%,
        rgb(var(--arcoblue-3)) 0 18.75%
      );
    background-size: 60px 60px;
    background-position: 0 0, 0 0;
    background-color: var(--color-neutral-2);
    width: 280px;
    margin: 10px;
    box-shadow: rgb(var(--arcoblue-2)) 0px 30px 30px -10px;
    transition: all 0.5s ease-in-out;
  }

  .card:hover {
    background-position: -100px 100px, -100px 100px;
    transform: rotate3d(0.5, 1, 0, 15deg);
  }

  .content-box {
    cursor: pointer;
    height: 80px;
    // background: rgba(41, 110, 235, 0.832);
    background: rgb(var(--arcoblue-4));
    /* border-radius: 10px 100px 10px 10px; */
    transition: all 0.5s ease-in-out;
    padding: 25px;
    // transform-style: preserve-3d;
  }

  .content-box .card-title {
    display: inline-block;
    color: var(--color-neutral-1);
    font-size: 20px;
    font-weight: 900;
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 50px);
  }

  .content-box .card-title:hover {
    transform: translate3d(0px, 0px, 60px);
  }

  .content-box .card-content {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 700;
    color: var(--color-neutral-2);
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 30px);
  }

  .content-box .card-content:hover {
    transform: translate3d(0px, 0px, 60px);
  }

  .content-box .see-more {
    cursor: pointer;
    margin-top: 10px;
    display: inline-block;
    font-weight: 900;
    font-size: 10px;
    text-transform: uppercase;
    color: var(--color-neutral-6);
    /* border-radius: 5px; */
    background: var(--color-neutral-2);
    padding: 0.5rem 0.7rem;
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 20px);
  }

  .content-box .see-more:hover {
    transform: translate3d(0px, 0px, 60px);
  }

  .date-box {
    position: absolute;
    top: 30px;
    right: 30px;
    height: 60px;
    width: 60px;
    background: white;
    border: 1px solid rgb(7, 185, 255);
    /* border-radius: 10px; */
    padding: 10px;
    transform: translate3d(0px, 0px, 80px);
    box-shadow: rgba(100, 100, 111, 0.2) 0px 17px 10px -10px;
  }

  .date-box span {
    display: block;
    text-align: center;
  }

  .date-box .month {
    color: rgb(4, 193, 250);
    font-size: 9px;
    font-weight: 700;
  }

  .date-box .date {
    font-size: 20px;
    font-weight: 900;
    color: rgb(4, 193, 250);
  }
}
</style>
