<template>
  <el-container style="height: 100%;">
    <el-aside :span="8" v-if="userId">
      <el-container class="rooms">
        <el-header>Messages
          <div class="add-chat-btn" @click="createChat">+</div>
        </el-header>
        <chat-list :userid="userId" @pick_chat="setChat"></chat-list>
      </el-container>
    </el-aside>
    <el-main :span="16">
      <chat-timeline ref="timeline"
                     :user_id="userId"
                     :current_chat_id="currentChatId"
                     :current_chat_name="currentChatName"></chat-timeline>
      <text-form :user_id="userId" :current_chat_id="currentChatId"></text-form>
    </el-main>
  </el-container>
</template>

<style>
  .rooms {
    background: #f7f9f9;
    height: 100vh;
    overflow-y: auto;
  }

  .rooms header {
    background: #fffbfb;
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 3.87em;
    position: relative;
  }

  .rooms .add-chat-btn {
    font-size: 3em;
    position: absolute;
    top: 0;
    right: .2em;
    line-height: 1em;
    color: #555;
    cursor: pointer;
  }
</style>

<script>
  import ChatList from 'components/chatList';
  import TextForm from 'components/textForm';
  import ChatTimeline from 'components/chatTimeline';
  //  future tweak: show how many users have read your msg
  export default {
    data: {
      currentChatId: '',
      currentChatName: '',
      userId: ''
    },
    components: {
      ChatList,
      TextForm,
      ChatTimeline,
    },
    methods: {
      setChat: function (chat) {
        if (chat) {
          this.currentChatId = chat.id;
          this.currentChatName = chat.name;
          console.log(this.$refs.timeline);
          this.$refs.timeline.getMessages();
        }
      },

      createChat: function () {
        //  get users except
        // get
        alert('chat creating window now!');
      }
    },
    created: function () {
      // TODO: replace it with connection to auth server response data
      localStorage.setItem('userID', '5a981b69e8986125f8d78f92');
      localStorage.setItem('userName', 'John Doe');
    },
    mounted: function () {
      console.log(this);
      this.userId = localStorage.getItem('userID');
      console.log(this.$refs);
    }
  };
</script>
