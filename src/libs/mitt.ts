import mitt from 'mitt'

type Events = {
  openThemeDrawer: undefined
}

export const emitter = mitt<Events>()
