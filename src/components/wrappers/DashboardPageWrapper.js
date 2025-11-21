import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button, Container, Grid, Stack } from '@mui/material';
import { IconDashboard, IconDropDown, IconEmail, IconLogo } from '@/assets/icons/IconsComponent';
import { useAuth } from '@/contexts/AuthProvider';
import { useThemeMode } from '@/contexts/ThemeProvider';
import { ClassColor } from '@/classes/ClassColor';
import LoginPageWrapper from './LoginPageWrapper';
import TextFieldPasswordComponent from '../elements/TextFieldPasswordComponent';
import TextFieldComponent from '../elements/TextFieldComponent';
import ButtonNextComponent from '../elements/ButtonNextComponent';
import LoginComponent from '../login/LoginComponent';
import { useTranslation } from 'react-i18next';
import { NS_DASHBOARD_MENU } from '@/contexts/i18n/settings';
import RegisterComponent from '../login/RegisterComponent';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Preloader from '../shared/Preloader';

const drawerWidth = 240;

function DashboardPageWrapper({ children, title = "", subtitle = "", icon = <></>, ...props }) {
    const { t } = useTranslation([NS_DASHBOARD_MENU]);
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const { theme } = useThemeMode();
    const { primary, background, backgroundMenu, text, blueDark } = theme.palette;
    const { user, isLoading, login, logout } = useAuth();
    const [accordionMenu, setAccordionMenu] = useState('');
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
                backgroundImage: 'url("/images/login/back.png")',
                backgroundSize: 'cover',        // l'image couvre tout l'écran
                backgroundPosition: 'center',   // centrée
                backgroundRepeat: 'no-repeat',  // pas de répétition

            }}>
            <Stack spacing={3} alignItems={'center'} justifyContent={'space-between'} sx={{ pb: 2, px: 1, background: 'rgba(0,0,0,0.1)', width: '100%', height: '100%' }}>
                <Stack sx={{ width: '100%', height: '100%' }} alignItems={'center'}>
                    <Toolbar disableGutters variant="dense" sx={{ width: '100%', maxHeight: '30px', p: 2 }}>
                        <Stack sx={{ width: '100%', height: '100%' }} justifyContent={'center'} alignItems={'center'}>
                            <IconLogo color={ClassColor.WHITE} width={'50%'} />
                        </Stack>
                    </Toolbar>
                    <Divider />
                    <List sx={{ py: 2, background: '', width: '100%', height: '100%', }}>
                        {
                            user?.menuDashboard().map((menuItem, i) => {
                                const hasSubs = menuItem.subs?.length > 0 || false;
                                const isPath = path === menuItem.path;
                                return (<ListItem key={`${menuItem.name}-${i}`} disableGutters sx={{ color: ClassColor.WHITE, background: '' }} disablePadding>
                                    <Stack spacing={1} sx={{ width: '100%', background: '', pb: 0.5 }}>
                                        <Stack sx={{ px: 1, py: 1, background: isPath ? ClassColor.WHITE : '', borderRadius: isPath ? '5px' : '0px' }}>
                                            <Link href={menuItem.path}>
                                                <Grid container spacing={0.5} sx={{
                                                    justifyContent: "start",
                                                    alignItems: "stretch",
                                                    width: '100%',
                                                    color: isPath ? blueDark.main : ClassColor.WHITE,
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
                                                        return (<ListItemButton key={`${item.name}-${i}`} disableGutters sx={{ background: 'red' }}>
                                                            <Grid container spacing={0.5} sx={{
                                                                justifyContent: "start",
                                                                alignItems: "stretch",
                                                                width: '100%'
                                                            }} direction={'row'} justifyContent={'center'} alignItems={'center'}>
                                                                <Grid size={'auto'} sx={{ background: 'yellow' }}>
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
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton sx={{ color: ClassColor.WHITE }}>
                                    <ListItemIcon sx={{ color: ClassColor.WHITE }}>
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Stack>
                <Button variant='contained' sx={{ background: 'red', color: backgroundMenu.main }}>
                    {'disconect'}
                </Button>
            </Stack>
        </Stack>
    );

    // Remove this const when copying and pasting into your project.
    const container = window !== undefined ? () => window().document.body : undefined;
    if (isLoading) {
        return (<Preloader />);
    }
    if (!user) {
        return (<LoginComponent />);
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                elevation={1}
                position="fixed"
                sx={{
                    //maxHeight:'40px',
                    //p:2,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    background: background.main,
                }}
            >
                <Toolbar disableGutters variant="dense" sx={{ minHeight: '40px', maxHeight: '50px', p: 2, }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' }, color: blueDark.main }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ py: 1, height: '100%', color: text.main }}>
                        {
                            user?.showAvatar()
                        }
                        <Typography variant="h6" noWrap component="div">
                            {user?.getCompleteName() || ''}
                        </Typography>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
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
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 0, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Container maxWidth={'xl'} sx={{ py: 1, background: '', }}>
                    <Stack maxWidth={'lg'} alignItems={'start'} sx={{background:'orange'}}>
                        <Stack direction={'row'} alignItems={'center'} spacing={0.5}><div style={{color:primary.main}}>{icon}</div><Typography variant='h3'>{title}</Typography></Stack>
                            <Typography sx={{ color: ClassColor.GREY_LIGHT }}>{subtitle}</Typography>

                            <Box sx={{mt:1.5}}>
                                {children}
                            </Box>
                    </Stack>
                </Container>

                <Typography sx={{ marginBottom: 2 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                    enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
                    imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
                    Convallis convallis tellus id interdum velit laoreet id donec ultrices.
                    Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                    adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
                    nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
                    leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
                    feugiat vivamus at augue. At augue eget arcu dictum varius duis at
                    consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                    sapien faucibus et molestie ac.
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                    Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
                    eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
                    neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
                    tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
                    sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                    tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
                    gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                    et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
                    tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                    eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                    posuere sollicitudin aliquam ultrices sagittis orci a.
                </Typography>
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
