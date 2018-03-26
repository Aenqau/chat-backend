<template>
  <div>
    <chat-timeline ref="timeline"
                   :user_id="userId"
                   :current_chat_id="currentChatId"
                   :current_chat_name="currentChatName"></chat-timeline>
    <text-form :user_id="userId" :current_chat_id="currentChatId"></text-form>
  </div>
</template>

<script>
  import Vue from 'vue';
  import TextForm from 'components/textForm';
  import ChatTimeline from 'components/chatTimeline';
  import VueSocketio from 'vue-socket.io';

  Vue.use(VueSocketio, 'localhost:5000');
  export default {
    data () {
      return {
        currentChatId: '',
        currentChatName: '',
        userId: ''
      }
    },
    components: {
      TextForm,
      ChatTimeline
    },
    created() {
      this.userId = localStorage.getItem('userID');
      this.currentChatId = this.$router.currentRoute.params.oid;
    },
    mounted() {
      console.log('joining chat, id = '+this.currentChatId),
      this.$socket.emit('join', {chatId: this.currentChatId}),
      this.$refs.timeline.getMessages()
    },
    updated: function (){
      console.log('joining chat, id = '+this.currentChatId);
      this.$socket.emit('join', {chatId: this.currentChatId});
      this.$refs.timeline.getMessages();
    },
    beforeRouteUpdate (to, from, next) {
      this.currentChatId = to.params.oid;
      next()
    }
  };
</script>
