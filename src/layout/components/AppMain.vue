<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
    <div class="app-footer">
      备案号
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding-bottom: 50px;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
.app-footer {
  width: 100%;
  padding: 15px 0;
  height: 48px;
  position: fixed;
  bottom: 0;
  right: 0;
  padding-left: 210px;
  text-align: center;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,0.3);
  z-index: 3;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
