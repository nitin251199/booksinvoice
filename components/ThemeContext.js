import React from 'react';

export const ThemeContext = React.createContext();

export const ThemeProvider = ({children}) => {
  // theme = light, dark
  const [theme, setTheme] = React.useState('dark');
  const [darkMode, setDarkMode] = React.useState(true);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      setDarkMode(true);
    } else {
      setTheme('light');
      setDarkMode(false);
    }
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme, darkMode}}>
      {children}
    </ThemeContext.Provider>
  );
};
