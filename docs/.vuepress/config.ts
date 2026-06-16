import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  base: '/blog/',
  lang: 'zh-CN',
  title: 'upcloudrabbit blog',
  description: 'a private blog website',

  head: [
    // 配置站点图标
    ['link', { rel: 'icon', type: 'image/png', href: 'https://theme-plume.vuejs.press/favicon-32x32.png' }],
  ],

  bundler: viteBundler(),
  shouldPrefetch: false, // 站点较大，页面数量较多时，不建议启用

  extendsBundlerOptions(bundlerOptions) {
    // 排除未安装的可选视频播放器依赖，避免 Vite 优化警告
    const include = (bundlerOptions as any).viteOptions?.optimizeDeps?.include
    if (include) {
      const exclude = ['dashjs', 'hls.js', 'mpegts.js']
      ;(bundlerOptions as any).viteOptions.optimizeDeps.include = include.filter(
        (dep: string) => !exclude.some(pkg => dep === pkg || dep.startsWith(pkg + '/')),
      )
    }
  },

  theme: plumeTheme({
    /* 添加您的部署域名, 有助于 SEO, 生成 sitemap */
    hostname: 'https://upcloudrabbit.github.io/blog/',

    /* 文档仓库配置，用于 editLink */
    // docsRepo: '',
    // docsDir: 'other',
    // docsBranch: '',

    /* 页内信息 */
    editLink: false,
    lastUpdated: true,
    contributors: true,
    changelog: false,

    /* 站点搜索 */
    search: { provider: 'local' },

    /**
     * 代码块高亮
     * @see https://theme-plume.vuejs.press/config/plugins/code-highlight/
     */
    codeHighlighter: {
      theme: 'one-dark-pro',
      languages: ['java', 'python', 'go', 'js', 'ts', 'bash', 'cpp', 'c',
        'rust', 'xml', 'properties', 'json', 'cmake', 'toml'],
      twoslash: false,
      lineNumbers: true,
    },

    /**
     * markdown 增强功能
     * @see https://theme-plume.vuejs.press/config/plugins/#markdownchart
     */
    markdown: {
      // 图表
      mermaid: true,
      chartjs: true,
      echarts: true,
      flowchart: true,

      // markdown power 功能
      pdf: true,
      caniuse: true,
      plot: true,
      bilibili: true,
      youtube: true,
      artPlayer: true,
      audioReader: true,
      icon: true,
      codepen: true,
      codeSandbox: true,
      jsfiddle: true,
      npmTo: true,
      demo: true,
      repl: {
        go: true,
        rust: true,
        kotlin: true,
      },

      // markdown 数学公式
      math: { type: 'katex' },

      // markdown 文件包含
      include: true,
    },

    /**
     * 文章字数统计、阅读时间
     */
    readingTime: true,

    /**
     * 水印
     * @see https://theme-plume.vuejs.press/guide/features/watermark/
     */
    watermark: true,

    /**
     * 页面加密，匹配 work 目录下所有文档
     * @see https://theme-plume.vuejs.press/config/encrypt/
     */
    encrypt: {
      rules: {
        '/work/': '1415450231',
      },
    },

    /**
     * 编译缓存，加快编译速度
     * @see https://theme-plume.vuejs.press/config/basic/#cache
     */
    cache: 'filesystem',

    /**
     * 评论 comments
     * @see https://theme-plume.vuejs.press/guide/features/comments/
     */
    // comment: {
    //   provider: '', // "Artalk" | "Giscus" | "Twikoo" | "Waline"
    //   comment: true,
    //   repo: '',
    //   repoId: '',
    //   category: '',
    //   categoryId: '',
    //   mapping: 'pathname',
    //   reactionsEnabled: true,
    //   inputPosition: 'top',
    // },
  }),
})
