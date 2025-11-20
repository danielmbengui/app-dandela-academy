import { useRef } from "react";

export default function CheckboxComponent({ name, checked, onChange, label,disabled=false }) {
  const checkboxRef = useRef(null);
    return (
        <label htmlFor={name} className="flex items-center gap-2">
          {
            //<label htmlFor="accept-pp">{accept} {terms} {t(`${NS_COMMON}:and`)} {privacy}</label>
          }
            <input
            ref={checkboxRef}
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                style={{ cursor: 'pointer' }}
                className="h-4 w-4 text-blue-600 focus:ring-secondaryColor border-gray-300 rounded"
            />
            <span style={{ cursor: 'pointer' }} onClick={(e)=>{
              e.preventDefault();
              checkboxRef.current.click();
            }}>{label}</span>
        </label>
    );
  }