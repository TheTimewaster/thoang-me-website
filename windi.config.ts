import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['IBM Plex Serif', 'serif'],
      },
      colors: {
        'primary': {
          DEFAULT: '#6439FA',
          '50': '#F0ECFF',
          '100': '#E1D8FE',
          '200': '#C1B0FD',
          '300': '#A289FC',
          '400': '#8361FB',
          '500': '#6439FA',
          '600': '#3B06F5',
          '700': '#2E05BE',
          '800': '#210387',
          '900': '#140251'
        },
        'mint': {
          DEFAULT: '#2DFAA9',
          '50': '#B8FDE2',
          '100': '#A5FDDA',
          '200': '#7DFCCA',
          '300': '#55FBB9',
          '400': '#2DFAA9',
          '500': '#06E98F',
          '600': '#04B36E',
          '700': '#037C4C',
          '800': '#02452A',
          '900': '#000E09'
        },
        'brick': {
          DEFAULT: '#F96446',
          '50': '#FFF9F8',
          '100': '#FEE8E4',
          '200': '#FDC7BD',
          '300': '#FCA695',
          '400': '#FA856E',
          '500': '#F96446',
          '600': '#F73610',
          '700': '#C82706',
          '800': '#921C05',
          '900': '#5C1203'
        },
        'lemon': {
          DEFAULT: '#FAEA5F',
          '50': '#FEFCE9',
          '100': '#FEFAD6',
          '200': '#FCF4AE',
          '300': '#FBEF87',
          '400': '#FAEA5F',
          '500': '#F8E329',
          '600': '#E2CB07',
          '700': '#AB9A05',
          '800': '#756904',
          '900': '#3F3802'
        },
        'peach': {
          DEFAULT: '#FFE1DB',
          '50': '#FFF2EF',
          '100': '#FFE1DB',
          '200': '#FFB2A3',
          '300': '#FF846B',
          '400': '#FF5533',
          '500': '#FA2A00',
          '600': '#C22000',
          '700': '#891700',
          '800': '#510E00',
          '900': '#190400'
        }
      }
    },

  }
})