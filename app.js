const { createApp } = Vue;

const prismHighlighter = {
  template: `<pre ref="pre" :class="preClass"><code ref="code" :class="codeClass"></code></pre>`,
  props: {
    language: {
      type: String,
      default: 'javascript'
    },
    plugins: {
      type: Array,
      default () {
        return []
      }
    },
    use: {
      type: Function,
      default () {
        return true
      }
    },
    code: {
      type: String,
      default: ''
    },
    preRender: {
      type: Function,
      default (code) {
        return code.replace(/\s+data-v-\S+="[^"]*"/g, '')
      }
    },
    warn: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    preClass () {
      return {
        'command-line': this.hasPlugin('command-line'),
        'line-numbers': this.hasPlugin('line-numbers')
      }
    },
    codeClass () {
      return {
        [`language-${this.language}`]: true
      }
    }
  },
  methods: {
    render () {
      // if (!Prism.languages[this.language]) {
      //   require(`prismjs/components/prism-${this.language}`)
      // }

      let pluginCount = 0
      this.plugins.forEach(plugin => {
        if (Prism.plugins && Prism.plugins[plugin]) {
          return true
        }

        if (tryRequirePlugin(plugin, this.warn)) {
          pluginCount++
        }
      })
      if (pluginCount) {
        this.use(Prism, this)
      }

      // always update codetext to the code value
      // otherwise see if the text has already been obtained
      // otherwise obtain it from innerHTML
      this.codeText = this.code || this.codeText || this.$refs.code.innerHTML
      this.$nextTick(() => {
        this.$refs.code.textContent = this.preRender(this.codeText, this)
        Prism.highlightElement(this.$refs.code)
      })
    },
    hasPlugin (plugin) {
      return this.plugins.indexOf(plugin) !== -1
    },
  },
  mounted () {
    this.render()
  },
  watch: {
    code () {
      this.render()
    },
    language () {
      this.render()
    },
    plugins () {
      this.render()
    }
  },
  mounted() {
    window.Prism = window.Prism || {};
    window.Prism.manual = true;

    Prism.highlightAll();
  },
  data () {
    return {
      codeText: ''
    }
  }
}

const app = createApp({
  data() {
    return {
        code: '',
        language: 'typescript'
    }
  }
});

app.component('prism', prismHighlighter);

app.mount('#app');

