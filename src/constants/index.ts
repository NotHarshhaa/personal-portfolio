import {
  AVATAR,
  ABOUT,
  LINKS,
  CAREER,
  PROJECTS,
  SPECIALTIES,
  TECH_STACK,
  CURRENT_FOCUS,
  EXPERTISE,
  FEATURED_PROJECTS,
  LEARNING_HUB
} from '@/data'
import type {
  AvatarProps,
  AboutProps,
  LinksProps,
  CareerProps,
  ProjectProps
} from '@/types'

export const data = {
  avatar: AVATAR as AvatarProps,
  about: ABOUT as AboutProps,
  links: LINKS as LinksProps[],
  career: CAREER as CareerProps[],
  projects: PROJECTS as ProjectProps[],
  specialties: SPECIALTIES,
  techStack: TECH_STACK,
  currentFocus: CURRENT_FOCUS,
  expertise: EXPERTISE,
  featuredProjects: FEATURED_PROJECTS,
  learningHub: LEARNING_HUB
}

export const navLinks = [
  { title: 'About', label: 'about', url: '/' },
  { title: 'Career', label: 'career', url: '/career' },
  {
    title: 'Blog',
    label: 'blog',
    url: 'https://blog.harshhaareddy.com',
    external: true
  },
  { title: 'Projects', label: 'projects', url: '/projects' },
  { title: 'Contact', label: 'contact', url: '/contact' }
]
