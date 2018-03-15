<template>
    <div class="chat-rooms">
        <div>
            <p>User2</p>
        </div>
        <div>
            <p>chatName</p>
        </div>
    </div>
</template>

<script>
    export default {
        components: {
        },
        data() {
            return {
                chatList: []
            };
        },
        async created() {
            this.chatList = await axios.get('/api/chat', {
                responseType: 'json'
            });
        },
        events: {
        }
    };
</script>
