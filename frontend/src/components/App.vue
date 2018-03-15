<template>

  <el-container style="height: 100%;">
    <el-header>

        <nav-bar />

    </el-header>
    <el-main>
      <router-view
                   element-loading-text="Loading..."
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="rgba(255, 255, 255, 0.8)">
      </router-view>
      <chat-list></chat-list>
    </el-main>
  </el-container>

</template>

<script>
import NavBar from 'components/navBar';
import ChatList from 'components/chatList';

export default {
  components: {
    NavBar,
    ChatList
  }
};
</script>
