import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Breadcrumbs, Button, Container, Grid, Stack } from '@mui/material';
import { IconDropDown, IconLogo } from '@/assets/icons/IconsComponent';
import { useAuth } from '@/contexts/AuthProvider';
import { useThemeMode } from '@/contexts/ThemeProvider';
import { ClassColor } from '@/classes/ClassColor';
import { useTranslation } from 'react-i18next';
import { NS_BUTTONS, NS_DASHBOARD_MENU } from '@/contexts/i18n/settings';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Preloader from '../shared/Preloader';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LoginPageWrapper from './LoginPageWrapper';
import LoginComponent from '../auth/login/LoginComponent';
import OtherPageWrapper from './OtherPageWrapper';
import NotAuthorizedComponent from '../auth/NotAuthorizedComponent';
import { PAGE_NOT_AUTHORIZED } from '@/contexts/constants/constants_pages';

const drawerWidth = 240;

function DashboardPageWrapper({ children, titles = [], title = "", subtitle = "", icon = <></>, ...props }) {
    const { t } = useTranslation([NS_DASHBOARD_MENU]);
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const { theme } = useThemeMode();
    const { primary, background, cardColor, backgroundMenu, text, blueDark } = theme.palette;
    const { user, isLoading, logout } = useAuth();
    const [accordionMenu, setAccordionMenu] = useState('');
    const router = useRouter();
    const path = usePathname();
    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <Stack
            alignItems={'center'}
            justifyContent={'space-between'}

            sx={{
                height: '100vh',
                width: '100%',
                background: 'var(--background-menu)',
                //backgroundImage: 'url("/images/login/back.png")',
                //backgroundSize: 'cover',        // l'image couvre tout l'écran
                //backgroundPosition: 'center',   // centrée
                //backgroundRepeat: 'no-repeat',  // pas de répétition
                //background: 'black',
                //border: '3px solid red',
            }}>
            <Stack spacing={3} alignItems={'center'} justifyContent={'space-between'} sx={{ pb: 2, px: 1, width: '100%', height: '100%' }}>
                <Stack sx={{ width: '100%', height: '100%' }} alignItems={'center'}>
                    <Toolbar disableGutters variant="dense" sx={{ width: '100%', maxHeight: '30px', p: 2 }}>
                        <Stack sx={{ width: '100%', height: '100%' }} justifyContent={'center'} alignItems={'center'}>
                            <IconLogo color={"var(--primary)"} width={'50%'} />
                        </Stack>
                    </Toolbar>
                    <Divider />
                    <List sx={{ py: 2, px: 1.5, background: '', width: '100%', height: '100%', }}>
                        {
                            user?.menuDashboard().map((menuItem, i) => {
                                const hasSubs = menuItem.subs?.length > 0 || false;
                                const isPath = path.includes(menuItem.path);
                                return (<ListItem key={`${menuItem.name}-${i}`} disableGutters sx={{ color: "var(--font-color)", background: '' }} disablePadding>
                                    <Stack spacing={1} sx={{ width: '100%', background: '', pb: 0.5 }}>
                                        <Stack sx={{
                                            px: 1.5, py: 1, cursor: 'pointer',
                                            background: isPath ? "var(--primary)" : 'var(--background-menu-item)',
                                            borderRadius: '20px',
                                            color: isPath ? "var(--card-color)" : "var(--primary)",
                                            "&:hover": {
                                                background: 'var(--primary)',
                                                color: 'var(--card-color)',
                                            }
                                        }}>
                                            <Link href={menuItem.path}>
                                                <Grid container spacing={0.5} sx={{
                                                    justifyContent: "start",
                                                    alignItems: "stretch",
                                                    width: '100%',


                                                }} direction={'row'} justifyContent={'center'} alignItems={'center'}>
                                                    <Grid size={'auto'}>
                                                        <Stack alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', height: '100%', background: '' }}>
                                                            {menuItem.icon}
                                                        </Stack>
                                                    </Grid>
                                                    <Grid size={'grow'}>
                                                        <Stack alignItems={'start'} justifyContent={'center'} sx={{ width: '100%', height: '100%', background: '' }}>
                                                            <Typography fontSize={'16px'}>{t(menuItem.name)}</Typography>
                                                        </Stack>

                                                    </Grid>
                                                    {
                                                        hasSubs && <Grid size={'auto'} sx={{ background: '' }}>
                                                            <Stack alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', height: '100%', background: '' }}>
                                                                <IconDropDown height={10} />
                                                            </Stack>

                                                        </Grid>
                                                    }



                                                </Grid>
                                            </Link>
                                        </Stack>
                                        {
                                            hasSubs && <Stack spacing={1} sx={{ pl: 3, pt: 1, pb: 2, background: '' }}>
                                                {
                                                    menuItem.subs?.map((item, i) => {
                                                        return (<ListItemButton key={`${item.name}-${i}`} disableGutters sx={{ background: '' }}>
                                                            <Grid container spacing={0.5} sx={{
                                                                justifyContent: "start",
                                                                alignItems: "stretch",
                                                                width: '100%'
                                                            }} direction={'row'} justifyContent={'center'} alignItems={'center'}>
                                                                <Grid size={'auto'} sx={{ background: '' }}>
                                                                    <Stack alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', height: '100%', background: 'blue' }}>
                                                                        {item.icon}
                                                                    </Stack>
                                                                </Grid>
                                                                <Grid size={'grow'} sx={{ background: 'orange' }}>
                                                                    <Stack alignItems={'start'} justifyContent={'center'} sx={{ width: '100%', height: '100%', background: 'blue' }}>
                                                                        <Typography fontSize={'14px'}>{t(item.name)}</Typography>
                                                                    </Stack>

                                                                </Grid>
                                                            </Grid>
                                                        </ListItemButton>)
                                                    })
                                                }
                                            </Stack>
                                        }
                                    </Stack>
                                </ListItem>)
                            })
                        }
                    </List>
                </Stack>
                <Button
                    variant='contained'
                    //sx={{ color: backgroundMenu.main }}
                    onClick={async () => {
                        await logout();
                    }}
                >
                    {t('disconnect', {ns:NS_BUTTONS})}
                </Button>
            </Stack>
        </Stack>
    );
    const isAllowed = useMemo(() => {
        if (!user) return false;
        const menus = user?.menuDashboard?.() || [];
        // Choisis la règle :
        //return menus.some(m => path === m.path || path.startsWith(m.path + "/") || path.startsWith(m.path));
        return true;
    }, [user, path]);

    useEffect(() => {
        if (!isLoading && user && !isAllowed) {
            router.push(PAGE_NOT_AUTHORIZED);
        }
    }, [isLoading, user, isAllowed, router]);
    //console.log("PATH", path,user?.menuDashboard(),user?.menuDashboard().includes(path));


    // Remove this const when copying and pasting into your project.
    // const container = window !== undefined ? () => window().document.body : undefined;
    if (isLoading) {
        return (<Preloader />);
    }
    if (!user) {
        return (<LoginPageWrapper>
            <LoginComponent />
        </LoginPageWrapper>);
    }
    if (user && !isAllowed) return <Preloader />; // afficher le loader le temps de la redirection vers la page non autorisé
    return (
        <Box sx={{ display: 'flex', background: 'var(--background-menu)', overflow: 'hidden', height: '100vh' }}>

            <AppBar
                elevation={0}
                position="fixed"
                sx={{
                    background: 'var(--background-menu)'
                    //zIndex: (theme) => theme.zIndex.drawer + 1 
                }}
            >
                <Toolbar disableGutters variant="dense" sx={{ minHeight: '40px', maxHeight: '40px', py: 1, px: 2, }}>
                    <Stack direction={'row'} alignItems={'center'} justifyContent={{ xs: 'space-between', sm: 'end' }} sx={{ width: '100%', background: '' }}>
                        <IconButton
                            //color="var(--primary)"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' }, color: "var(--primary)" }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Stack direction={'row'} spacing={0.5} alignItems={'center'} sx={{ fontWeight: 600, py: 0.25, px: 0.5, height: '100%', color: "var(--primary)", border: `1px solid var(--primary-shadow-md)`, borderRadius: '20px', background: "var(--primary-shadow-sm)" }}>
                            {
                                user?.showAvatar({ size: 20, fontSize: '5px' })
                            }
                            <Stack>
                                <Typography variant={'string'} noWrap fontSize={'12px'}>
                                    {user?.getCompleteName() || ''}
                                </Typography>
                            </Stack>
                            <IconDropDown height={6} />
                        </Stack>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Box
                //component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    //container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true, // Better open performance on mobile.
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        border: 'none',
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                    slotProps={{
                        paper: {
                            sx: {
                                width: drawerWidth,
                                boxSizing: "border-box",
                                borderRight: "none",
                                boxShadow: "none",
                                backgroundImage: "none",
                            },
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ background: '', width: '100vw', position: 'relative' }}
            >
                <Toolbar disableGutters variant="dense" sx={{ minHeight: '40px', maxHeight: '40px', py: 1, px: 2, }} />
                <Container disableGutters maxWidth={'xl'} sx={{
                    position: 'absolute',
                    top: '40px',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "100vh",
                    width: '100%',
                    py: 1,
                    px: { xs: 1, sm: 2 },
                    background: 'var(--background)', 
                    mt: 0,
                    borderTopLeftRadius: { xs: 0, sm: '20px' }
                }}>
                    <Stack
                        //spacing={1}
                        position={'relative'}
                        maxWidth="lg"
                        alignItems="start"
                        justifyContent="start"
                        sx={{
                            width: "100%",
                            height: "100%",
                            pb: 5,
                            // ✅ layout colonne qui remplit
                            display: "flex",
                            flexDirection: "column",
                            overflowY: 'hidden',

                            // ✅ clé pour permettre le scroll enfant
                            minHeight: 0,

                            // (debug)
                        }}
                    >
                        <Stack justifyContent={'center'} sx={{ background: '', width: '100%', py: 1 }} spacing={{ xs: 1, sm: 0.5 }}>
                            <Breadcrumbs maxItems={2} sx={{ color: 'var(--font-color)' }} separator={<NavigateNextIcon />} aria-label="breadcrumb">
                                {
                                    titles.length === 1 && <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                                        <div style={{ color: primary.main }}>{icon}</div>
                                        <Typography variant='h5'>{titles[0].name}</Typography>
                                    </Stack>
                                }
                                {
                                    titles.length > 1 && titles.map((title, i) => {
                                        if (i < titles.length - 1) {
                                            return (<Link key={`${title}-${i}`} underline="hover" style={{ fontStyle: 'underline' }} color="inherit" href={title.url} >
                                                <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                                                    {
                                                        i === 0 && <div style={{ color: primary.main }}>{icon}</div>
                                                    }
                                                    <Typography variant='h5' sx={{ textDecoration: 'underline' }}>{title.name}</Typography>
                                                </Stack>
                                            </Link>)
                                        }
                                        return (<Typography key={`${title}-${i}`} sx={{ color: 'text.primary', }}>{title.name}</Typography>)
                                    })
                                }
                            </Breadcrumbs>
                            <Typography sx={{ color: 'var(--grey-light)' }}>{subtitle}</Typography>

                        </Stack>
                        <Stack maxWidth={'lg'} alignItems={'start'} justifyContent={'start'} sx={{
                            overflowY: 'auto',
                            //overflowY: 'auto', 
                            background: '', minHeight: 0,
                            width: '100%', 
                            minWidth:'100%',
                            height: '100vh', py: 1,
                            width: "100%",
                            flex: 1,          // prend le reste
                            minHeight: 0,     // ✅ clé
                            //overflowY: "auto",// ✅ scroll ici
                            //pr: 1,            // optionnel pour éviter que le scrollbar colle au bord
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(0,0,0,0.35) transparent",

                            // Chrome/Safari/Edge
                            "&::-webkit-scrollbar": {
                                width: "10px",
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "transparent",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "rgba(0,0,0,0.25)",
                                borderRadius: "999px",
                                border: "2px solid transparent",
                                backgroundClip: "content-box",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "rgba(0,0,0,0.4)",
                            },
                        }}>
                            {children}
                        </Stack>
                    </Stack>

                </Container>
            </Box>
        </Box>
    );
}

DashboardPageWrapper.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window: PropTypes.func,
};

export default DashboardPageWrapper;
