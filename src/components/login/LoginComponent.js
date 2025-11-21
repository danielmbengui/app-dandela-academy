import React, { useState } from "react";
import LoginPageWrapper from "../wrappers/LoginPageWrapper";
import { Alert, Stack, Typography } from "@mui/material";
import TextFieldComponent from "../elements/TextFieldComponent";
import { IconEmail } from "@/assets/icons/IconsComponent";
import TextFieldPasswordComponent from "../elements/TextFieldPasswordComponent";
import ButtonNextComponent from "../elements/ButtonNextComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { set } from "zod";
export default function LoginComponent() {
    const { user, login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    return (<LoginPageWrapper>
        <Typography>
            Se connecter
        </Typography>
        <Stack spacing={1}>
            <TextFieldComponent
                //label='email'
                name='email'
                icon={<IconEmail width={20} />}
                placeholder='example@dandela-academy.com'
                value={email}
                onChange={(e) => {
                    e.preventDefault();
                    setEmail(e.target.value);
                    setError('');
                }}
                onClear={() => {
                    setEmail('');
                    setError('')
                }}

            />
            <TextFieldPasswordComponent
                //label='email'
                name='password'
                placeholder='password'
                value={password}
                onChange={(e) => {
                    e.preventDefault();
                    setPassword(e.target.value);
                    setError('')
                }}
                onClear={() => {
                    setPassword('');
                    setError('')
                }}

            />
        </Stack>
        {
            error !== '' && (<Alert severity="error">{error}</Alert>)
        }

        <ButtonNextComponent
            label='Se connecter'
            disabled={email === '' || password === ''}
            onClick={async () => {
                const result = await login(email, password);
                const { success, error, user } = result;
                console.log('login result', result);
                if (!success) {
                    setError(error.message);
                }
            }}
        />
    </LoginPageWrapper>);
}