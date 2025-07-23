import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Fade,
  IconButton,
  Tooltip,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import Footer from '../components/Footer';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../utils/firebase';
import theme from '../theme';

export default function LoginPage() {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [mode, setMode] = useState('login');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = () => {
    setResetDialogOpen(true);
    setResetSent(false);
    setError('');
    setResetEmail('');
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    setError('');
    setResetSent(false);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 2, md: 4 },
        }}
      >
      <Fade in timeout={600}>
        <Box
          sx={{
            p: { xs: 4, sm: 6, md: 8 },
            width: '100%',
            maxWidth: { xs: 400, sm: 480, md: 520 },
            borderRadius: 4,
            backgroundColor: 'white',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            mx: 'auto',
            position: 'relative',
          }}
        >
          {/* Language Toggle Button */}
          <Tooltip title={`${t('language')}: ${language === 'en' ? t('english') : t('vietnamese')}`}>
            <IconButton
              onClick={toggleLanguage}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: '#f8fafc',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                zIndex: 10,
                '&:hover': {
                  bgcolor: '#e2e8f0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <LanguageIcon sx={{ color: '#64748b' }} />
            </IconButton>
          </Tooltip>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 2, md: 3 } }}>
            <img
              src='/pwa-192x192.png'
              alt='Spending Tracker'
              style={{ width: 80, height: 80, borderRadius: '50%' }}
            />
          </Box>
          <Typography 
            variant='h4' 
            align='center' 
            gutterBottom 
            fontWeight={700}
            sx={{ mb: { xs: 3, md: 4 }, color: '#1e293b' }}
          >
            {mode === 'login' ? t('welcomeBack') : t('createAccount')}
          </Typography>
          {mode === 'login' ? (
            <SignIn
              onSwitchMode={() => setMode('signup')}
              onForgotPassword={handleForgotPassword}
            />
          ) : (
            <SignUp onSwitchMode={() => setMode('login')} />
          )}
        </Box>
      </Fade>
      </Box>

      <Footer />

      <Dialog
        open={resetDialogOpen}
        onClose={() => {
          setResetDialogOpen(false);
          setResetSent(false);
          setError('');
        }}
      >
        <DialogTitle>{t('resetPassword')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('email')}
            type='email'
            fullWidth
            margin='normal'
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          {resetSent && (
            <Alert severity='success'>{t('passwordResetEmailSent')}</Alert>
          )}
          {error && (
            <Alert severity='error' sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setResetDialogOpen(false);
              setResetSent(false);
              setError('');
            }}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handlePasswordReset}
            disabled={loading || !resetEmail}
            variant='contained'
            sx={{
              backgroundColor: theme.colors.primary.main,
              '&:hover': {
                backgroundColor: theme.colors.primary.dark,
              },
            }}
          >
            {loading ? <span>{t('sending')}</span> : t('sendResetEmail')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
