<template>
  <div class="input-camera">
    // capture属性用于调起摄像头
    <input ref="inputRef" class="input" type="file" accept="image/*" capture="environment" @change="onChange">
    // 用于显示图片
    <img :src="photoSrc" ref="photoRef" class="photo" @click="choicePhoto" />
  </div>
</template>

<script setup>
import {ref} from "vue";
const inputRef = ref()
const photoSrc = ref("")
const photoRef = ref()

function choicePhoto() {
  inputRef.value.click()
}
function onChange(event) {
  // 获取图片
  const file = event.target.files[0]
  if (file) {
    // 读取图片
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = f => {
      // 绘制图片的到img上（这里可以通过canvas进行优化
      photoSrc.value = f.target.result
    }
  }
}
</script>

<style scoped lang="less">
.input-camera {
  height: 100vh;
  width: 100vw;
  position: relative;
  .input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
  .photo {
    height: 300px;
    width: 100%;
    object-fit: contain;
  }
}
</style>