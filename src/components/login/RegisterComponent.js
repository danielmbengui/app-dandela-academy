import React, { useState } from "react";
import LoginPageWrapper from "../wrappers/LoginPageWrapper";
import { Alert, Stack, Typography } from "@mui/material";
import TextFieldComponent from "../elements/TextFieldComponent";
import { IconEmail } from "@/assets/icons/IconsComponent";
import TextFieldPasswordComponent from "../elements/TextFieldPasswordComponent";
import ButtonNextComponent from "../elements/ButtonNextComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { set } from "zod";
import FieldComponent from "../elements/FieldComponent";
import { isValidEmail } from "@/contexts/functions";
export default function RegisterComponent({ isLogin = false, setIsLogin = null }) {
    const { user, login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    return (<LoginPageWrapper>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography variant="h4">
                Activer mon compte
            </Typography>
            <Typography color="primary" sx={{ cursor: 'pointer' }} onClick={() => {
                if (setIsLogin) {
                    setIsLogin(prev => !prev);
                }
            }}>
                Me connecter
            </Typography>
        </Stack>
        <Stack spacing={1}>
            <FieldComponent
                label='Email'
                name='email'
                type="email"
                icon={<IconEmail width={20} />}
                placeholder='example@dandela-academy.com'
                value={email}
                onChange={(e) => {
                    e.preventDefault();
                    setEmail(e.target.value);
                    setError('');
                    setErrorEmail('');
                }}
                onClear={() => {
                    setEmail('');
                    setError('');
                    setErrorEmail('');
                }}
                error={errorEmail}
            />
            <FieldComponent
                label='Mot de passe'
                name='password'
                type="password"
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
            loading={isLoading}
            label='Se connecter'
            disabled={email === '' || password === ''}
            onClick={async () => {
                setIsLoading(true);
                const validEmail = isValidEmail(email);
                if (!validEmail) {
                    setErrorEmail('Veuillez entrer une adresse email valide.');
                    setIsLoading(false);
                    return;
                }
                const result = await login(email, password);
                const { success, error, user } = result;
                console.log('login result', result);
                if (!success) {
                    setError(error.message);
                }
                setIsLoading(false);
            }}
        />
    </LoginPageWrapper>);
}