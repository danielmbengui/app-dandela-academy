import { useThemeMode } from "@/contexts/ThemeProvider";
import { Button } from "@mui/material";

export default function ButtonNextComponent({label="Button",loading=false,disabled=false,onClick=null,fullWidth=false, type='button',...props}) {
    const {theme} = useThemeMode();
    const {primary}=theme.palette;
    return(<Button
        type={type}
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        //elevation={0}
        className={`${fullWidth ? 'w-full' : ''} hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark`}
        variant={'contained'}
        sx={{
          py: '10px',
          px: '25px',
          bgcolor: primary.main,
          color: primary.contrastText,
          textTransform: 'none',
          fontSize: '15px',
          //border: `1px solid ${primary.main}`,
          mb: 2,
          border: '1px solid transparent',          // évite le “jump” au hover
          '&:hover': {
            //bgcolor: 'primary.dark',
            borderColor: primary.main,
          },
          '&.Mui-disabled': {
            bgcolor: 'action.disabledBackground',
            color: 'action.disabled',
          },
        }}
        {...props}
      >
        {label}
      </Button>)
}