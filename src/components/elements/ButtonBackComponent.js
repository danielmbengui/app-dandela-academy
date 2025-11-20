import { Button } from "@mui/material";

export default function ButtonBackComponent({ label = "Button", disabled = false, onClick = null}) {
  return (<Button
    disabled={disabled}
    onClick={onClick}
    //elevation={0}
    //className={`${fullWidth ? 'w-full' : ''} hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark`}
    variant={'text'}

    type="button"
    color="blueDark"
    //style={{cursor:'pointer'}}
    className="text-primaryColor hover:text-secondaryColor rounded-md font-medium transition-colors duration-200"

  >
    {label}
  </Button>)
}