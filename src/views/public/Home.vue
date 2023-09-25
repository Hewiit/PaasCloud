<template>
  <div
      :style="{ backgroundImage: `url(${require('/src/assets/hello.jpg')})`,
         backgroundSize: 'cover' ,
         backgroundPosition:'center center'}">
    <div class="home"
         >
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
