<script>
    export default {
        data() {
            return {
                requiresLogout: false,                 //Bandera que determina si existe un usuario esta autentificado//
                error: false,                         //Bandera que determina si se ha producido un error//
            };
        },

        async mounted() {      
            //Validamos si hay un usuario autentificado, obtenemos primero las cuentas de la extensión
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length) {
                this.requiresLogout = true;
                return;
            } 

            //Mostramos la pantalla de Logout
            //this.$router.push('/Login');
        },

        methods: {
            //Función de acceso
            async logout() {
                //Obtenemos la cuenta con la que se está tratando de acceder
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

                //Si hay respuesta vamos a la pantalla de Login
                if (accounts.length) this.$router.push('/Login');
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
      <!-- Sección de logout, se muestra o no dependiendo de la bandera requiresLogin -->
      <div v-if="requiresLogout">
        <button @click="logout">Logout</button>
      </div>  
    </div>
</template>