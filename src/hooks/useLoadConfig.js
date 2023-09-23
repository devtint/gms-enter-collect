import { ref } from 'vue'
import service from '@/api/request';
import { Notification } from '@arco-design/web-vue';

export const useLoadConfig = () => {
  let loadSpin = ref(false);

  // 刷新配置
  loadSpin.value = true;
  Notification.info({
    id: 'load-config',
    title: '刷新配置',
    content: '正在刷新配置, 请稍等...',
  });

  service
    .get('/loadConfig')
    .then((response) => {
      console.log(response);
      setTimeout(() => {
        loadSpin.value = false;
        Notification.success({
          id: 'load-config',
          title: '刷新配置',
          content: '刷新配置成功,请重试',
        });
      }, 500);
      return loadSpin
    })
    .catch((error) => {
      console.log(error);
      loadSpin.value = false;
      return loadSpin
    });
};
