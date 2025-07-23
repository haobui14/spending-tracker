import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { auth } from '../utils/firebase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const GREEN = '#219a6f';

export default function SignIn({ onSwitchMode, onForgotPassword }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label={t('email')}
          type='email'
          fullWidth
          margin='normal'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete='email'
        />
        <TextField
          label={t('password')}
          type='password'
          fullWidth
          margin='normal'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete='current-password'
        />
        <Button
          type='submit'
          variant='contained'
          color='success'
          fullWidth
          sx={{
            mt: 2,
            py: 1.2,
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: 1,
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color='inherit' /> : t('login')}
        </Button>
      </Box>
      <Divider sx={{ my: 3 }}>{t('or')}</Divider>
      <Button
        onClick={handleGoogleSignIn}
        variant='outlined'
        color='success'
        fullWidth
        sx={{
          py: 1.2,
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: 1,
          mb: 1,
          border: `1.5px solid ${GREEN}`,
        }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color='inherit' />
        ) : (
          t('signInWithGoogle')
        )}
      </Button>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          onClick={onSwitchMode}
          size='small'
          sx={{ textTransform: 'none', color: GREEN, fontWeight: 600 }}
        >
          {t('dontHaveAccount')}
        </Button>
        <Button
          onClick={onForgotPassword}
          size='small'
          sx={{ textTransform: 'none', color: GREEN, fontWeight: 600 }}
        >
          {t('forgotPasswordQuestion')}
        </Button>
      </Box>
      {error && (
        <Alert severity='error' sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
