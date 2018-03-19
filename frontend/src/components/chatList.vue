<template>
  <div class="chat-rooms">
    <el-container
        v-for="(chat) in chatList"
        class="chat-room"
        :class="{ 'active' : chat.active}"
        @click.native="pickChat(chat);">
      <el-row class="chat-room-inner" type="flex">
        <el-col :span="7">
          <div class="pic">
            <img src="" alt="">
          </div>
        </el-col>
        <el-col :span="17">
          <el-row>
            <el-col :span="18" class="username">{{ chat.name }}</el-col>
            <el-col :span="6" class="date">18:14</el-col>
          </el-row>
          <p>
            Lorem ipsum dolor sit amet
          </p>
          <!-- there will be last msg or first of unread -->
          <p></p>
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
          response.data.map((item) => {
            item.active = false;
            this.chatList.push(item);
          });
        });
      }
    },
    methods: {
      pickChat: function (chat) {
        this.chatList.forEach((el)=>{el.active = false;});
        chat.active = true;
        this.$emit('pick_chat', {
          id: chat._id,
          name: chat.name
        });
      }
    }
  };
</script>
