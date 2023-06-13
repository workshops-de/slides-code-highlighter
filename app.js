const { createApp } = Vue;

createApp({
  data() {
    return {
        code: '',
        language: ''
    }
  }
}).use(hljsVuePlugin).mount('#app');

