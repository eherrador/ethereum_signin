<script setup>
  import Web3 from 'web3';
  window.web3 = new Web3(Web3.givenProvider);
</script>

<script>
export default {
  async mounted(){
    try {
        const accounts = await window.web3.eth.getAccounts();

        if (!accounts.length) {
          throw Error('No accounts given: ' + accounts);
        }
 
        window.account = accounts[0];

        // Validamos si es una cuenta EOA
        let bytecode = await window.web3.eth.getCode(accounts[0]);
        if (bytecode === '0x') {          
          console.log('Es una EOA...');
          this.$router.push('/logout');
        }
        else {
          console.log('No es una EOA...');
        }
      } 
      catch (e) {
        console.log('Cuenta no autenticada:\n\n', e);
        this.$router.push('/login');
      }
  },
}
</script>

<template>
  <div>
    <h1>DeSci para Science Connexion</h1>
  </div>
  <div class="app container">
    <header></header>
  </div>
  <main>
    <router-view />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  body {
    background-color: #FFFFFF;
  }

  .header_title {
    margin-top: 0;
    background-color: #205A41;
    color: #FFFFFF;
    height:50px;
    display: flex;
    justify-content: space-around;
    align-items: revert;
  }

  .header_title > img {
    height: 45px;
    width: auto
  }

  .title {
    color: #205A6B;
    margin: 0, 0, 0, 50px;
  }

  button, .button {
    margin: 10px 10px;
    background-color: #246145;
    border-color: #246145;
  }

  button:hover, .button :hover {
    background-color: #6FA088;
  }

  button:focus, .button:focus{
    background-color: #6FA088
  }
}
</style>
