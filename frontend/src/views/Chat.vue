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
  import TextForm from 'components/textForm';
  import ChatTimeline from 'components/chatTimeline';
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
      this.$refs.timeline.getMessages();
    },
    updated(){
      this.$refs.timeline.getMessages();
    },
    beforeRouteUpdate (to, from, next) {
      this.currentChatId = to.params.oid;
      next()
    }
  };
</script>
