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

  let _stream

  errorText.value = isPhone ? 'true' : 'false'

  onMounted(async () => {
    start()
  })

  const videoWidth = ref(0)
  const videoHeight = ref(0)

// 绘制方法
  let isDrawing = false
  function draw(context, dom) {
    if (!isDrawing) { return }
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

  function start() {
    const v = unref(video)

    // 调用用户摄像头权限（待兼容）
    navigator.mediaDevices.getUserMedia({
      // 通过exact可以选择设备哪一个摄像头
      video: isPhone ? { facingMode: { exact: 'environment'} } : { facingMode: 'environment' },
      audio: false,
    })
        .then(stream => {
          // 保存数据流到外部，方便操控
          _stream = stream

          // 将视频流导入到video标签中
          v.srcObject = stream

          // 启动播放，要求video标签有muted、playsinline属性（playsinline是为了兼容iPhone，不加这个属性在安卓手机上可以播放，但是iPhone不会播放
          v.play()

          // 将视频绘制到canvas上，以便后面进行截图
          setTimeout(() => {
            const context = canvas.value.getContext('2d')
            isDrawing = true
            draw(context, v)
          }, 100)
        })
        .catch(err => {
          errorText.value = err
        })
  }

  // 截图并且关闭摄像头
  function cutAndClose() {
    // 停止绘制
    isDrawing = false
    // 关闭数据流
    _stream.getTracks().forEach((track) => {
      track.stop()
    })

    // 关闭视频流
    _stream.getVideoTracks().forEach(track => {
      track.stop()
    })

    // 内存回收
    _stream = null

    // 清空video的数据源（关闭依赖，使得可以进行垃圾回收，在chrome上必须执行这一步，摄像头权限才会被收回）
    video.value.srcObject = null
  }
</script>

<template>
  <div class="web-camera">
    <div>{{ errorText }}</div>
    <video ref="video" autoplay muted loop playsinline></video>
    <canvas ref="canvas" :height="videoHeight" :width="videoWidth" />
    <div>
      <button @click="start">重拍</button>
      <button @click="cutAndClose" >拍照</button>
    </div>
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
