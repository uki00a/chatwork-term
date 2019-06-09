const colors = {
  white: '#ffffff',
  black: '#000000',
  darkblue: '#00008b',
  blue: '#0000ff',
  cyan: '#00ffff',
  darkcyan:	'#008B8B',
  lightGray: '#e7e7e7',
  grayishBlue: '#373b41',
  nebula: '#c5c8c6',
  silver: '#c0c0c0'
};

const themes = {
  dark: {
    box: {
      fg: colors.white,
      bg: colors.black,
      focus: {
        border: { fg: colors.cyan }
      },
      hover: {
        bg: colors.silver,
        fg: colors.black
      },
      scrollbar: { bg: colors.lightGray }
    },
    list: {
      selected: {
        bg: colors.grayishBlue,
        fg: colors.nebula
      }
    }
  },
  'dark-blue': {
    box: {
      fg: colors.white,
      bg: colors.darkblue,
      focus: {
        border: { fg: colors.cyan }
      },
      hover: {
        bg: colors.silver,
        fg: colors.black
      },
      scrollbar: { bg: colors.blue }
    },
    list: {
      selected: {
        bg: colors.grayishBlue,
        fg: colors.nebula,
      }
    }
  },
  light: {
    box: {
      fg: colors.black,
      bg: colors.white,
      focus: {
        border: { fg: colors.darkcyan }
      },
      hover: {
        bg: colors.silver,
        fg: colors.black
      },
      scrollbar: { bg: colors.lightGray }
    },
    list: {
      selected: {
        bg: colors.grayishBlue,
        fg: colors.nebula,
      }
    }
  }
};

export const initializeTheme = themeName => {
  const {
    box,
    list
  } = themes[themeName] || themes.dark;

  return Object.freeze({
    box: box,
    list: Object.assign({}, box, list),
    text: box,
    editor: box,
    loader: box
  });
};
