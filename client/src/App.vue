<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">

        <!-- <div>Инит: {{ isInit }}</div> -->
        <!-- <div>Авторизован: {{ isSignIn }}</div> -->
        <div>
            <button @click="signIn()" v-if="!isSignIn">✔ Войти</button>
            <button @click="signOut()" v-if="isSignIn">❌ Выйти</button>
        </div>
    </div>
</template>

<script>

    import axios from "axios"

    export default {
        name: 'App',
        data() {
            return {
                isInit: false,
                isSignIn: false
            }
        },
        mounted() {
            let checkGauthLoad = setInterval(() => {
                this.isInit = this.$gAuth.isInit;
                this.isSignIn = this.$gAuth.isAuthorized;
                if (this.isInit) {
                    clearInterval(checkGauthLoad);
                }
            }, 1000);
        },
        methods: {
            async getAuthCode() {
                const authCode = await this.$gAuth.getAuthCode()
                return authCode;
            },

            async signIn() {
                if (!this.isInit) {
                    const auth_response = await this.getAuthCode();
                    console.log("auth_response", auth_response)
                }

                const googleUser = await this.$gAuth.signIn();

                this.isSignIn = this.$gAuth.isAuthorized;

                if (this.isSignIn) {

                    const user_basic_profile = googleUser.getBasicProfile();

                    const g_id = googleUser.getId();
                    const g_name = user_basic_profile.getName();
                    const g_given_name = user_basic_profile.getGivenName();
                    const g_family_name = user_basic_profile.getFamilyName();
                    const g_image_url = user_basic_profile.getImageUrl();
                    const g_mail = user_basic_profile.getEmail();

                    const user = {
                        g_id: g_id,
                        name: g_name,
                        given_name: g_given_name,
                        family_name: g_family_name,
                        image_url: g_image_url,
                        mail: g_mail
                    }



                    const response = await axios.post('http://localhost:3000/user', {
                        user: user
                    });

                    alert(response.data);

                }
            },

            signOut() {
                this.$gAuth.signOut()
                    .then(() => {
                        this.isSignIn = this.$gAuth.isAuthorized
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }
    }
</script>

<style lang="stylus">
    #app
        font-family Avenir, Helvetica, Arial, sans-serif
        -webkit-font-smoothing antialiased
        -moz-osx-font-smoothing grayscale
        text-align center
        color #2c3e50
        margin-top 60px
</style>
