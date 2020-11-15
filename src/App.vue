<template>
  <transition name="el-fade-in-linear">
    <router-view />
  </transition>
</template>

<style lang="scss">
html {
  font-family: 'Roboto', sans-serif;
}
html, body, body > [class*=-view], .el-container, .el-main {
  height: 100%;
}
.w100 {
  width: 100%;
}
.h100 {
  height: 100%;
}
.d-flex {
  display: flex !important;
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
.el-form-item {
  margin-bottom: .75rem !important;
  &__error {
    right: 4px;
    left: initial !important;
  }
  &__label {
    padding: 0 !important;
  }
}
.fade-enter-active, .fade-leave-active{
  transition:opacity .3s
}
.fade-enter-active{
  display:none
}
.fade-enter, .fade-leave-to{
  opacity:0
}
</style>
