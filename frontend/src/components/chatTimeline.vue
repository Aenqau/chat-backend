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
          <div class="msg-text" >
            <div class="options" @mouseleave="message.optionsOpen = false" v-if="message.isAuthor" @click="message.optionsOpen = true">
              <div class="options-list"  :class="{'active': message.optionsOpen }">
                <div class="edit" @click="editMessage(message);">Edit message</div>
                <div class="remove" @click="removeMessage(message);">Remove message</div>
              </div>
            </div>
            {{ message.body }}
          </div>
        </el-row>
      </el-container>
    </el-main>
  </el-container>
</template>

<style>

  .chat-timeline {
    width: 100%;
    max-height: calc(100vh - 172px);
    overflow-y: auto;
  }

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
    border-radius: 10px;
    box-shadow: 0 0 10px 2px rgba(230, 230, 230, 1);
    padding: .5em 2.5em;
    position: relative;
    .options {
      width: 16px;
      height: 32px;
      position: absolute;
      left: 15px;
      top: 4px;
      transition: all .3s ease;
      opacity: 0;
      cursor: pointer;
      background: url("/images/menu.png") center no-repeat;
      background-size: contain;
      pointer-events: none;
    }
    .options-list {
      position: absolute;
      z-index: 1;
      top: 100%;
      left: -14px;
      min-width: 150px;
      padding: 10px;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0 0 10px 2px rgba(230, 230, 230, 1);
      display: none;
      font-size: .8em;
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 40px;
        bottom: 100%;
        right: 0;
      }
      &.active {
        display: block;
      }
      div {
        &:hover {
          color: #E95700;
        }
        &+div {
          margin-top: 4px;
        }
        &::before {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          margin-right: 8px;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        &.edit::before {
          background-image: url("/images/edit.png");
        }
        &.remove::before {
          background-image: url("/images/delete.png");
        }
      }
    }
    &:hover {
      .options {
        opacity: 1;
        pointer-events: initial;
      }
    }
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
  import Vue from 'vue';
  import axios from '../my-axios';
  import moment from 'moment';
  import VueSocketio from 'vue-socket.io';
  import io from 'socket.io-client';

  const socket = io('localhost:5000/chat');
  Vue.use(VueSocketio, socket);
  export default {
    props: ['current_chat_id', 'current_chat_name', 'user_id'],
    data() {
      return {
        messages: []
      };
    },
    sockets: {
      connect: function () {
        console.log('connected');
      },
      messagePosted: function (response) {
        const msg = response.data;
        msg.isAuthor = msg.author === this.user_id;
        msg.optionsOpen = false;
        this.messages.push(msg);
      },
      messageDeleted: function (response) {
        alert('message deleted');
      },
      tweet: function (tweet) {
        console.log(tweet);
      }
    },
    filters: {
      formatDate: function (value) {
        if (value) {
          return moment(String(value)).format('MM/DD/YYYY')
        }
      }
      ,
      formatTime: function (value) {
        if (value) {
          return moment(String(value)).format('hh:mm')
        }
      }
    },
    methods: {
      editMessage(message) {
        console.log('editing message');
        console.log(message);
      },
      async removeMessage(message) {
        await axios.delete('/messages/' + message._id, {
          responseType: 'json',
        }).then(response => {
          response.data.messages.map((item) => {
            item.isAuthor = item.author === this.user_id;
            item.optionsOpen = false;
            this.messages.push(item);
          });
        });
        console.log('removing message');
        console.log();
      },
      async getMessages() {
        this.messages = [];
        await axios.get('/messages/' + this.current_chat_id, {
          responseType: 'json',
        }).then(response => {
          response.data.messages.map((item) => {
            item.isAuthor = item.author === this.user_id;
            item.optionsOpen = false;
            this.messages.push(item);
          });
        });
      }
    }
  };
</script>
