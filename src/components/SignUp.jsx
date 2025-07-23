import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import theme from '../theme';

export default function SignUp({ onSwitchMode }) {
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
      await createUserWithEmailAndPassword(auth, email, password);
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
          autoComplete='new-password'
        />
        <Button
          type='submit'
          variant='contained'
          fullWidth
          sx={{
            mt: 2,
            py: 1.2,
            fontWeight: theme.typography.fontWeight.semibold,
            fontSize: theme.typography.fontSize.base,
            letterSpacing: 1,
            backgroundColor: theme.colors.primary.main,
            '&:hover': {
              backgroundColor: theme.colors.primary.dark,
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color='inherit' /> : t('signUp')}
        </Button>
      </Box>
      <Button
        onClick={onSwitchMode}
        size='small'
        sx={{ 
          textTransform: 'none', 
          color: theme.colors.primary.main, 
          fontWeight: theme.typography.fontWeight.semibold, 
          mt: 2 
        }}
      >
        {t('alreadyHaveAccountLogin')}
      </Button>
      {error && (
        <Alert severity='error' sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
