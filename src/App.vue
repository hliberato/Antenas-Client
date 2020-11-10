<template>
  <transition name="el-fade-in-linear">
    <router-view />
  </transition>
</template>

<style lang="scss">
html {
  font-family: 'Roboto', sans-serif;
}
html, body, body > div, .el-container, .el-main {
  height: 100%;
}
.w100 {
  width: 100%;
}
.h100 {
  height: 100%;
}
.flex {
  display: flex;
}
.justify-end {
  justify-content: flex-end;
}
.justify-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}
.flex-column {
  flex-direction: column;
}
.el-header {
  margin: 20px 0;
}
</style>
