<script setup>
import { onMounted, ref, unref } from "vue";

  const video = ref()
  const canvas = ref()

// 错误信息，用于在移动设备上进行调试
  const errorText = ref("")

  const ua = navigator.userAgent.toLowerCase()
  console.log(ua)
errorText.value = ua
const isPhone = /(android|iphone)/i.test(ua)

errorText.value = isPhone ? 'true' : 'false'

  onMounted(async () => {
    const v = unref(video)

    // 调用用户摄像头权限（待兼容）
    navigator.mediaDevices.getUserMedia({
      // 通过exact可以选择设备哪一个摄像头
      video: isPhone ? { facingMode: { exact: 'environment'} } : { facingMode: 'environment' },
      audio: false,
    })
        .then(stream => {
          // 将视频流导入到video标签中
          v.srcObject = stream

          // 启动播放，要求video标签有muted、playsinline属性（playsinline是为了兼容iPhone，不加这个属性在安卓手机上可以播放，但是iPhone不会播放
          v.play()

          // 将视频绘制到canvas上，以便后面进行截图
          setTimeout(() => {
            const context = canvas.value.getContext('2d')
            draw(context, v)
          }, 100)
        })
        .catch(err => {
          errorText.value = err
        })
  })

  const videoWidth = ref(0)
  const videoHeight = ref(0)

// 绘制方法
  function draw(context, dom) {
    if (dom.videoWidth && dom.videoHeight) {
      // 设置canvas宽高
      videoWidth.value = dom.videoWidth
      videoHeight.value = dom.videoHeight
      // 绘制图片
      context.drawImage(dom, 0, 0, videoWidth.value, videoHeight.value)
    } else {
      videoHeight.value = 0
      videoWidth.value = 0
      context.drawImage(dom, 0, 0, dom.offsetWidth, dom.offsetHeight)
    }
    // 每帧调用
    window.requestAnimationFrame(() => draw(context, dom))
  }
</script>

<template>
  <div class="web-camera">
    <div>{{ errorText }}</div>
    <video ref="video" autoplay muted loop playsinline></video>
    <canvas ref="canvas" :height="videoHeight" :width="videoWidth" />
  </div>
</template>

<style scoped lang="less">
.web-camera {
  > video {
    background: #213547;
    height: 300px;
    width: 100%;
  }
}
</style>
