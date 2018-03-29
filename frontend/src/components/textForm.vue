<template>
  <el-form :model="msgForm" ref="msgForm" class="message-form">
    <el-form-item class="message-area">
      <el-input
          type="textarea"
          autosize
          placeholder="Please input your message"
          v-model="msgForm.msg"
          @keydown.enter.native.exact.prevent="submitForm()">
      </el-input>
      <div class="send" @click="submitForm()">
        <img v-if="!loading" src="/images/send.svg" alt="">
        <img v-if="loading" class="placeholder" src="/images/cog.svg" alt="">
      </div>
    </el-form-item>
  </el-form>
</template>

<style>
  @keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  .message-form {
    border-top: 3px solid #eee;
  }
  textarea.el-textarea__inner {
    border: none;
    resize: none;
    white-space: pre-wrap;
    &.disabled {
      cursor: not-allowed;
    }
  }
  .send {
    position: absolute;
    top: 0;
    right: 15px;
    width: 20px;
    cursor: pointer;
    height: 20px;
    &.disabled {
      cursor: not-allowed;
    }
    span {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
  .placeholder {
    animation: spin 1s linear infinite;
  }
</style>

<script>
  import Vue from 'vue';
  import axios from '../my-axios';
  import VueSocketio from 'vue-socket.io';

  Vue.use(VueSocketio, 'localhost:5000');

  export default {
    components: {},
    props: ['current_chat_id', 'user_id'],
    data() {
      return {
        loading: false,
        msgForm: {
          msg: '',
        },
      };
    },
    methods: {
      submitForm() {
        if (!this.loading) {
          if (this.msgForm.msg) {
            this.loading = true;
            axios.post('/messages/' + this.user_id, {
              chat: this.current_chat_id,
              body: this.msgForm.msg,
            }).then(response => {
              this.$refs['msgForm'].resetFields();
              this.$socket.emit('messagePosted', {
                room: this.current_chat_id,
                message: response
              });
              this.loading = false;
              this.msgForm.msg = '';
            }).catch(error => error)
          }
        }
      },
    }
  };
</script>
