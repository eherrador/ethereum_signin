<script>
    import UniversalProfileContract from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
    import { Buffer } from 'buffer'
    import Web3 from 'web3';
    window.web3 = new Web3(Web3.givenProvider);
    // import { siwe, SiweMessage } from 'siwe';
    export default {
        data() {
            return {
                requiresLogin: false,                 //Bandera que determina si existe un usuario esta autentificado//
                error: false,                         //Bandera que determina si se ha producido un error//
            };
        },

        async mounted() {      
            //Validamos si hay un usuario autentificado, obtenemos primero las cuentas de la extensión
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (!accounts.length) {
                //Cambiamos el estatus de la bandera, para mostrar pantalla de acceso en la extensión//  
                this.requiresLogin = true;
                return;
            } 
        },

        methods: {
            //Función de acceso
            async login() {
                //Obtenemos la cuenta con la que se está tratando de acceder
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

                const domain = window.location.host;
                const origin = window.location.origin;
                const LUKSO_L16_CHAIN_ID = '22';
                const nonce = 'm97bdsjo'; // a randomized token, at least 8 alphanumeric characters
                const date = new Date();
                const issuedAt = date.toISOString();

                const siweMessage = `${domain} wants you to sign in with your Ethereum account:
                
                ${accounts[0]}

                By logging in you agree to the terms and conditions.

                URI: ${origin}
                Version: 1
                Chain ID: ${LUKSO_L16_CHAIN_ID}
                Nonce: ${nonce}
                Issued At: ${issuedAt}
                Resources:
                - https://terms.website.com`;

                //Si hay respuesta vamos a la pantalla de Logout
                if (accounts.length) {
                    console.log("%%%% Web3 version: ", window.web3.version);
                    console.log('%%%% Siwe Message: ', siweMessage);
                    //const signature = await window.web3.eth.sign(window.web3.utils.sha3(siweMessage), accounts[0]);
                    const msg = `0x${Buffer.from(siweMessage, 'utf8').toString('hex')}`;
                    const signature = await ethereum.request({
                        method: 'personal_sign',
                        params: [msg, accounts[0], 'Example password'],
                    });
                    console.log('%%%% Signature: ', signature);
                    const myUniversalProfileContract = new web3.eth.Contract(UniversalProfileContract.abi, '0x9F6FD4c811aa65278dD2FFd47020cfE1F538b461');
                    console.log('%%%% My Universal Profile Contract: ', myUniversalProfileContract);
                    const hashedMessage = web3.eth.accounts.hashMessage(siweMessage);
                    const MAGIC_VALUE = '0x1626ba7e'; // https://eips.ethereum.org/EIPS/eip-1271
                    // if the signature is valid it should return the magic value 0x1626ba7e
                    const isValidSignature = await myUniversalProfileContract.methods.isValidSignature(hashedMessage, signature).call();        
                    if (isValidSignature === MAGIC_VALUE) {
                        console.log('🎉 Log In successful!');
                        this.$router.push('/Logout');
                    } else {
                        // The EOA which signed the message has no SIGN permission over this UP.
                        console.log('😭 Log In failed');
                     }
                    //this.$router.push('/Logout');
                }
                else this.error = 'No fue seleccionada ninguna cuenta!';
            },
        },
    }
</script>

<template>
    <!--Sección de errores-->
    <p class="warning" v-if="error">
      {{ error }}
    </p>
    <div class="login center" v-else>  
      <!-- Sección de login, se muestra o no dependiendo de la bandera requiresLogin -->
      <div v-if="requiresLogin">
        <button @click="login">Login</button>
      </div>  
    </div>
</template>