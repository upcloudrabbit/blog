import {defineNavbarConfig} from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '分类', link: '/categories/' },
  { text: '标签', link: '/tags/' },
  { text: '归档', link: '/archives/' },
])
