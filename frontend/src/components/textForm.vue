<template>
    <el-form :model="msgForm" :rules="rules" ref="msgForm" label-width="120px">
        <el-form-item label="Message" prop="msg">
            <el-input
                    type="textarea"
                    autosize
                    placeholder="Please input your message"
                    v-model="msgForm.msg">
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm()">Send</el-button>
        </el-form-item>
    </el-form>
</template>

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
                msgForm: {
                    msg: '',
                },
                rules: {
                    msg: [
                        {required: true, message: 'Please enter a message', trigger: 'blur'},
                    ],
                },
            };
        },
        methods: {
            submitForm() {
                this.$refs['msgForm'].validate((valid) => {
                    if (valid) {
                        axios.post('/messages/' + this.user_id, {
                            chat: this.current_chat_id,
                            body: this.msgForm.msg,
                        }).then(response => {
                            this.$refs['msgForm'].resetFields();
                            this.$socket.emit('message', true);
                        }).catch(error => error)

                    } else {

                        return false;
                    }
                });
            },
        }
    };
</script>
