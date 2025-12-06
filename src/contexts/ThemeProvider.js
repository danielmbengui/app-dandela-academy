import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
//import { DEFAULT_THEME } from '@/libs/constants/constants';
import { DEFAULT_THEME, LOCAL_STORAGE_THEME, THEME_DARK, THEME_LIGHT, THEME_SYSTEM } from '@/contexts/constants/constants';

const safeValue = (value, fallback) => (value ? value.trim() : fallback);

const ThemeContext = createContext();

const useThemeColors = (themeMode) => {
    const [themeColors, setThemeColors] = useState({
        background: '#F5F4F4',
        cardColor: '#FFFFFF',
        fontColor: '#000000',
        fontReverseColor: '#FFFFFF',
        primary: '#1160e5',
        primaryShadow: '#1160e580',

        blue: '#1a5fde',
        blueDark: '#020617',
        blueLight: '#f2f9ff',
        blueLight1: '#bfdbfe',


        blueCyan: '#26d3e2',
        blueCyan1: '#24c1d3',
        //#f2f9ff
        // var(--blue-light-1)

        backgroundMenu: '#F5F4F4',
        greyLight: "#A6A6A6",
        backgroundSwitch: 'hsla(0, 0.00%, 82.67%, 1.00)',
        border: "rgba(236, 236, 236, 0.25)",
        textPrimary: '#000000',
        textReverse: '#FFFFFF',

        playpadPrimaryShadowChart: 'rgba(66, 133, 244,0.1)',
        secondary: '#e6fb94',
    });

    useEffect(() => {

        const root = document.documentElement;
        document.documentElement.className = themeMode; // Applique la classe du thème
        //document.documentElement['data-theme'] = themeMode; // Applique la classe du thème
        const computedStyles = getComputedStyle(root);
        //console.log("THEME", themeMode);
        const html = document.querySelector("html");
        //html.d
        const isDark = document.querySelector("main")?.classList?.contains("is-dark");
        if (isDark) {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
        //const currentMode = localStorage.getItem("theme");
        if (themeMode === "dark") {
            html.classList.add("dark");
        } else if (themeMode === "light") {
            html.classList.remove("dark");
        }
        /*
        const themeController = document.querySelector(".theme-controller");
        themeController.addEventListener("click", function () {
            html.classList.toggle("dark");
            const currentMode = html.classList.contains("dark");
            if (currentMode) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }
        });
        */
        setThemeColors((prev) => {

            return {
                ...prev,
                /*
                background: '#F5F4F4',
        cardColor: '#FFFFFF',
        fontColor: '#000000',
        fontReverseColor: '#FFFFFF',
        primary: '#1160e5',
                */
                background: safeValue(computedStyles.getPropertyValue('--background'), '#F5F4F4'),
                cardColor: safeValue(computedStyles.getPropertyValue('--card-color'), '#FFFFFF'),
                fontColor: safeValue(computedStyles.getPropertyValue('--font-color'), '#000000'),
                fontReverseColor: safeValue(computedStyles.getPropertyValue('--font-reverse-color'), '#FFFFFF'),
                primary: safeValue(computedStyles.getPropertyValue('--primary'), '#1160e5'),
                primaryShadow: safeValue(computedStyles.getPropertyValue('--primary-shadow'), '#1160e580'),


                blue: safeValue(computedStyles.getPropertyValue('--blue'), '#1a5fde'),
                blueDark: safeValue(computedStyles.getPropertyValue('--blue-dark'), '#020617'),
                blueLight: safeValue(computedStyles.getPropertyValue('--blue-light'), '#f2f9ff'),
                blueLight1: safeValue(computedStyles.getPropertyValue('--blue-light-1'), '#bfdbfe'),

                blueCyan: safeValue(computedStyles.getPropertyValue('--blue-cyan'), '#26d3e2'),
                blueCyan1: safeValue(computedStyles.getPropertyValue('--blue-cyan-1'), '#24c1d3'),



                backgroundMenu: safeValue(computedStyles.getPropertyValue('--background-menu'), '#F5F4F4'),
                greyLight: safeValue(computedStyles.getPropertyValue('--grey-light'), '#A6A6A6'),
                //backgroundSwitch: safeValue(computedStyles.getPropertyValue('--toggle-bg-devlink'), '#ffffff'),
                //border: safeValue(computedStyles.getPropertyValue('--border-color-devlink'), '#ffffff'),
                textPrimary: safeValue(computedStyles.getPropertyValue('--primary-text'), '#000000'),
                textReverse: safeValue(computedStyles.getPropertyValue('--reverse-text'), '#FFFFFF'),

                //playpadPrimaryShadowChart: safeValue(computedStyles.getPropertyValue('--playpad-primary-shadow-chart'), '#4285f4'),

                //secondary: safeValue(computedStyles.getPropertyValue('--playpad-second'), '#e6fb94'),
            }
        });

    }, [themeMode]);

    return themeColors;
};
function useSystemTheme() {
    const [theme, setTheme] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mq = window.matchMedia('(prefers-color-scheme: dark)');

        const updateTheme = (e) => {
            setTheme(e.matches ? 'dark' : 'light');
           // console.log("SYSTEM theme change", e.matches ? 'dark' : 'light')
        };

        // valeur initiale
        setTheme(mq.matches ? 'dark' : 'light');
       // console.log("SYSTEM theme", mq.matches ? 'dark' : 'light')
        // écoute les changements
        mq.addEventListener('change', updateTheme);

        return () => mq.removeEventListener('change', updateTheme);
    }, []);

    return theme;
}

export const ThemeProvider = ({ children }) => {
    const [modeApp, setModeApp] = useState(DEFAULT_THEME);
    const [themeMode, setThemeMode] = useState(THEME_LIGHT);
    const themeColors = useThemeColors(themeMode);
    const themeSystem = useSystemTheme();
    useEffect(() => {
        if (typeof window === 'undefined') return;
        var theme = localStorage.getItem(LOCAL_STORAGE_THEME) || DEFAULT_THEME; // Récupère la donnée du localStorage
        setModeApp(theme);
       // console.log("storage theme", theme);
        if (theme === THEME_SYSTEM) {
            theme = themeSystem || THEME_LIGHT;
        }
      //  console.log("system theme", themeSystem)
      //  console.log("final theme", theme)
        //theme = DEFAULT_THEME;
        //localStorage.setItem(LOCAL_STORAGE_THEME, theme);
        document.documentElement.className = theme; // Applique la classe du thème
        //document.documentElement['data-theme'] = theme; // Applique la classe du thème
        setThemeMode(theme);
        
        //localStorage.setItem(LOCAL_STORAGE_THEME, DEFAULT_THEME);
        //const actual = document.documentElement.className; // Applique la classe du thème
        //setThemeMode(actual);
    }, [themeSystem]);

    const toggleTheme = () => {
        var prev = DEFAULT_THEME;
        setThemeMode((prevMode) => {
            prev = prevMode;
            return (prevMode === THEME_LIGHT ? THEME_DARK : THEME_LIGHT);
        });
        const newTheme = prev === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
        document.documentElement.className = newTheme; // Applique la classe du thème
        //document.documentElement.className = newTheme; // Applique la classe du thème
        //document.documentElement['data-theme'] = newTheme; // Applique la classe du thème

        localStorage.setItem(LOCAL_STORAGE_THEME, newTheme);
        //console.log("NEW MODE", newTheme);
    };
    const changeTheme = (newTheme) => {
        var theme = newTheme;
        setModeApp(theme);
        if (newTheme === THEME_SYSTEM) {
            theme = themeSystem;
        }
        setThemeMode(theme);
        document.documentElement.className = theme; // Applique la classe du thème
        //document.documentElement['data-theme'] = newTheme; // Applique la classe du thème
        localStorage.setItem(LOCAL_STORAGE_THEME, newTheme);
    };

    // Création de la palette Material-UI basée sur les couleurs dynamiques
    const muiTheme = createTheme({
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 1024,
                lg: 1440,
                xl: 1920,
                xxl: 2560,
            },
        },
        typography: {
            allVariants: {
                lineHeight: 1,
            },
            h1: {
                //fontSize: '2.5rem',
                fontSize: `1.8rem`,
                fontWeight: 500,
                lineHeight: 1,
                //color: 'black',
            },
            h2: {
                //fontSize: '1.7rem',
                fontSize: `1.5rem`,
                fontWeight: 500,
                // color: 'black',
            },
            h3: {
                fontSize: '1.3rem',
                fontWeight: 600,
                // color: 'black',
            },
            h4: {
                fontSize: '1.1rem',
                fontWeight: 600,
                // color: 'black',
                '@media (max-width:600px)': {
                    //fontSize: '1.8rem',
                },
            },
            h5: {
                fontSize: '1rem',
                fontWeight: 600,
                //color: 'black',
                '@media (max-width:600px)': {
                   // fontSize: '1.5rem',
                },
            },
            h6: {
                fontSize: '0.8rem',
                fontWeight: 400,
                // color: 'black',
            },
            caption: {
                //fontSize: '1.2rem',
                fontSize: `0.9rem`,
                fontWeight: 300,
                color: themeColors.greyLight,
            },
            // h7 à h9 n'existent pas nativement : tu peux les créer comme classes custom
            h7: {
                fontSize: '1rem',
                fontWeight: 400,
                // color: 'black',
            },
            h8: {
                fontSize: '0.9rem',
                fontWeight: 400,
                // color: 'black',
            },
            h9: {
                fontSize: '0.8rem',
                fontWeight: 400,
                //color: 'black',
            },

        },
        palette: {
            mode: themeMode,
            primary: {
                main: themeColors.primary,
                contrastText: "#ffffff", // ← texte blanc sur fond "primary"
            },
            primaryShadow: {
                main: themeColors.primaryShadow,
                contrastText: themeColors.primary, // ← texte blanc sur fond "primary"
            },
            blue: {
                100: themeColors.blueLight,
                200: themeColors.blueLight1,
                600: themeColors.blue,
                900: themeColors.blueDark,
                main: themeColors.blue,
                text: themeColors.textReverse, // ← texte blanc sur fond "primary"
                contrastText: themeColors.textReverse, // ← texte blanc sur fond "primary"
            },
            blueDark: {
                main: themeColors.blueDark,
                contrastText: "#ffffff", // ← texte blanc sur fond "primary"
            },
            blueLight1: {
                main: themeColors.blueLight1,
                contrastText: themeColors.blue, // ← texte blanc sur fond "primary"
            },
            blueCyan: {
                main: themeColors.blueCyan,
                contrastText: themeColors.blue, // ← texte blanc sur fond "primary"
            },
            blueCyan1: {
                main: themeColors.blueCyan1,
                contrastText: themeColors.blue, // ← texte blanc sur fond "primary"
            },
            background: {
                main: themeColors.background,
                reverse: themeColors.fontColor,
                default: themeColors.background,
                paper: themeColors.cardColor,
            },
            cardColor: {
                main: themeColors.cardColor,
                contrastText: themeColors.fontColor, // ← texte blanc sur fond "primary"
            },
            text: {
                main: themeColors.fontColor,
                primary: themeColors.fontColor,
                reverse: themeColors.fontReverseColor,
            },
            backgroundMenu: {
                main: themeColors.backgroundMenu,
                default: themeColors.backgroundMenu,
                paper: themeColors.backgroundMenu,
            },
            greyLight: {
                main: themeColors.greyLight,
            },

            /*
            primaryShadowChart: {
              main: "#4285f4",
            },
            secondary: {
              main: "#4285f4",
            },
            
            border: {
              main: "#4285f4"
            },
            text: {
              //main: themeColors.textPrimary,
              primary: themeColors.textPrimary,
            },
            backgroundSwitch: {
              main: "#4285f4"
            }
            */
        },
    });
    return (
        <ThemeContext.Provider value={{modeApp, mode: themeMode, toggleTheme, changeTheme, theme: muiTheme }}>
            <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

// Hook pour accéder au mode de thème (light/dark) et basculer entre eux
export const useThemeMode = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within a ThemeProvider');
    }
    return context;
};
