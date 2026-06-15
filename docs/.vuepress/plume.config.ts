import { defineThemeConfig } from 'vuepress-theme-plume'
import { navbar } from './navbar'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: '/EditBlog.png',

  appearance: 'dark',  // 配置 深色模式

  social: [
    { icon: 'github', link: 'https://github.com/upcloudrabbit' },
  ],
  navbarSocialInclude: ['github'], // 允许显示在导航栏的 social 社交链接
  aside: true, // 页内侧边栏， 默认显示在右侧
  outline: [2, 3], // 页内大纲， 默认显示 h2, h3

  /**
   * 文章版权信息
   * @see https://theme-plume.vuejs.press/guide/features/copyright/
   */
  copyright: true,

  prevPage: true,   // 是否启用上一页链接
  nextPage: true,   // 是否启用下一页链接
  createTime: true, // 是否显示文章创建时间

  /* 站点页脚 */
  footer: {
    message: 'Power by upcloudrabbit',
    copyright: '',
  },

  /**
   * @see https://theme-plume.vuejs.press/config/basic/#profile
   */
  profile: {
    avatar: '/avatar.png',
    name: 'upcloudrabbit blog',
    description: '路漫漫其修远兮，吾将上下而求索',
    // circle: true,
    // location: '',
    // organization: '',
  },

  navbar,

  /**
   * 博客文章集合
   * @see https://theme-plume.vuejs.press/config/basic/#collections
   */
  collections: [
    {
      type: 'post',
      title: 'Blog',
      dir: '',
      link: '/',
      linkPrefix: '/article/',
      postList: false, // 是否启用文章列表页
      tags: true, // 是否启用标签页
      tagsLink: '/tags/',
      archives: true, // 是否启用归档页
      archivesLink: '/archives/',
      categories: true, // 是否启用分类页
      categoriesLink: '/categories/',
      postCover: 'right', // 文章封面位置
      pagination: { perPage: 5 }, // 每页显示文章数量
      exclude: ['.vuepress/**/*', 'README.md'],
      autoFrontmatter: {
        permalink: true,
        createTime: true,
        title: true,
      },
    },
  ],

  /**
   * 公告板
   * @see https://theme-plume.vuejs.press/guide/features/bulletin/
   */
  // bulletin: {
  //   layout: 'top-right',
  //   contentType: 'markdown',
  //   title: '公告板标题',
  //   content: '公告板内容',
  // },

  /* 过渡动画 @see https://theme-plume.vuejs.press/config/basic/#transition */
  transition: {
    page: true,        // 启用 页面间跳转过渡动画
    postList: true,    // 启用 博客文章列表过渡动画
    appearance: 'fade',  // 启用 深色模式切换过渡动画, 或配置过渡动画类型
  },
})
