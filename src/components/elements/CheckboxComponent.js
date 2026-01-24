import { Checkbox, FormControlLabel } from "@mui/material";
import { useRef } from "react";

export default function CheckboxComponent({ type, name, checked, onChange, label, disabled = false, required = false, isAdmin = false }) {
  const checkboxRef = useRef(null);
  return (
    <>
      <FormControlLabel
        className="text-contentColor dark:text-contentColor-dark block"
        sx={{
          ".MuiFormControlLabel-asterisk": {
            color: 'red'
          }
        }}
        control={<Checkbox
        color={isAdmin ? 'warning' : 'primary'}
          required={required}
          disableRipple
          name={name}
          size="small"
          checked={checked}
          value={checked}
          onChange={onChange}
          sx={{
    borderRadius: "4px",

    "&.MuiCheckbox-root": {
      borderColor: "green",
    },

    "&.MuiCheckbox-root.Mui-error": {
      border: "1px solid red",
    },

    "&.MuiCheckbox-root.Mui-disabled": {
      borderColor: "#ccc",
    },
  }}

        />}
        label={label}

        slotProps={{
          typography: {
            sx: {
              color: 'var(--grey-title)',
              fontWeight: 400,
              fontSize: "0.9rem"
              //pl:0
            }
          }
        }}
      />

{
  /*
        <label htmlFor={name} className="flex items-center gap-2">
        {
          //<label htmlFor="accept-pp">{accept} {terms} {t(`${NS_COMMON}:and`)} {privacy}</label>
        }
        <input
          ref={checkboxRef}
          type="checkbox"
          name={name}
          value={checked}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{ cursor: 'pointer' }}
          className={`h-4 w-4 ${isAdmin ? "orange" : "blue"} focus:ring-${isAdmin ? "orange" : "blue"} border-gray-100 rounded`}
        />

        {
          label && <label className="text-contentColor dark:text-contentColor-dark block" style={{ cursor: 'pointer', fontSize: '0.9rem' }} onClick={(e) => {
            e.preventDefault();
            checkboxRef.current.click();
            //onChange();
          }}>
            {label}{required && <b style={{ color: 'red' }}>*</b>}
          </label>
        }
      </label>
  */
}
    </>
  );
}