<template>
  <div class="chat-rooms">
    <el-container
        v-for="(chat) in chatList"
        class="chat-room"
        :class="{ 'active' : chat.active}"
        @click.native.once="pickChat(chat);">
      <el-row class="chat-room-inner" type="flex">
        <el-col :span="7">
          <div class="pic">
            <img src="" alt="">
          </div>
        </el-col>
        <el-col :span="17">
          <el-row>
            <el-col :span="18" class="username">{{ chat.name }}</el-col>
            <el-col :span="6" class="date">{{ chat.lastMsg.date | formatTime }}</el-col>
          </el-row>
          <p class="last-message">
            {{ chat.lastMsg.body }}
          </p>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<style>
  .chat-room {
    background: #fffefe;
    cursor: pointer;
  }

  .chat-room.active {
    background: #CFC7C2;
  }

  .chat-room-inner {
    width: 100%;
    align-items: center;
  }

  .chat-rooms .pic {
    width: 3em;
    height: 3em;
    margin: 1em auto;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    background: url("/static/images/user-pic-placeholder.png") center no-repeat;
    background-size: contain;
  }

  .chat-rooms .username {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chat-rooms .date {
    color: #7b7b7b;
  }

  .chat-rooms p {
    margin-bottom: 0;
  }
</style>

<script>
  import axios from '../my-axios';
  import moment from 'moment';

  export default {
    components: {},
    props: ['userid'],
    data() {
      return {
        chatList: []
      };
    },
    async created() {
      if (localStorage.getItem('userID')) {
        await axios.get('/chat/' + this.userid, {
          responseType: 'json',
        }).then(response => {
          response.data.map((chat) => {
            chat.active = false;
            chat.lastMsg = {
              body: '',
              date: ''
            };
            axios.get('/messages/' + chat._id, {
              responseType: 'json',
            }).then(response => {
              if (response.data.messages.length) {
                const lastMsgItem = response.data.messages[response.data.messages.length - 1];
                chat.lastMsg.body = lastMsgItem.body;
                chat.lastMsg.date = lastMsgItem.updated;
                if (lastMsgItem.author === this.userid) {
                  chat.lastMsg.body = 'You: ' + chat.lastMsg.body;
                }
              }
              this.chatList.push(chat);
            });
          });
        });
      }
    },
    filters: {
      formatTime: function (value) {
        if (value) {
          return moment(String(value)).format('hh:mm')
        }
      }
    },
    methods: {
      pickChat: function (chat) {
        this.chatList.forEach((el) => {
          el.active = false;
        });
        chat.active = true;
        this.$emit('pick_chat', {
          id: chat._id,
          name: chat.name
        });
      }
    }
  };
</script>
