<template>
  <el-container class="chat-timeline">
    <el-header>{{ current_chat_name }}</el-header>
    <el-main>
        <el-container
            v-for="message in messages"
            class="message"
            :class="{ 'is-author': message.isAuthor }"
            type="flex">
          <el-row class="msg-body" type="flex">
              <div class="author">
                <div class="pic" :title="message.author">
                  <img src="" alt="">
                </div>
                <span class="date" :title="message.updated | formatDate">
                {{ message.updated | formatTime }}
              </span>
              </div>
              <div class="msg-text">{{ message.body }}</div>
          </el-row>
        </el-container>
    </el-main>
  </el-container>
</template>

<style>
  .message.is-author {
   justify-content: flex-end;
  }
  .message.is-author .msg-body {
    flex-direction: row-reverse;
  }
  .msg-body {
    width: 50%;
    align-items: center;
  }
  .msg-body .date {
    color: #7b7b7b;
    font-size: .8em;
  }
  .msg-text {
    margin: 0 1.5em;
    background: #fff;
    border-radius: 1.2em;
    box-shadow: 0px 0px 20px 2px rgba(170,170,170,1);
    padding: .5em;
  }
  .msg-body .pic {
    width: 2em;
    height: 2em;
    margin: 0 auto .2em;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    background: url("/static/images/user-pic-placeholder.png") center no-repeat;
    background-size: contain;
  }
</style>

<script>
  import axios from '../my-axios';
  import moment from 'moment'
  export default {
    components: {},
    props: ['current_chat_id', 'current_chat_name', 'user_id'],
    data() {
      return {
        messages: []
      };
    },
    filters: {
      formatDate: function (value) {
        if (value) {
          return moment(String(value)).format('MM/DD/YYYY')
        }
      },
      formatTime: function (value) {
        if (value) {
          return moment(String(value)).format('hh:mm')
        }
      }
    },
    async created() {
      if (localStorage.getItem('userID')) {
        await axios.get('/messages/' + this.current_chat_id, {
          responseType: 'json',
        }).then(response => {
          response.data.messages.map((item) => {
            item.isAuthor = item.author == this.user_id;
            this.messages.push(item);
          });
        });
      }
    },
    methods: {
    }
  };
</script>
