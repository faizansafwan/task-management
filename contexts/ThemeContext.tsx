import { createContext, ReactNode, useContext, useState } from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  setTheme: () => {},
});

export const ThemeProviderCustom = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
