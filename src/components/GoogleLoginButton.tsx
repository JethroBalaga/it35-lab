// src/components/GoogleLoginButton.tsx
import { IonButton, IonIcon, useIonToast } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';
import { useIonRouter } from '@ionic/react';
import './GoogleLoginButton.css';

const GoogleLoginButton = () => {
  const router = useIonRouter();
  const [presentToast] = useIonToast();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/it35-lab/app'
        }
      });

      if (error) throw error;

      await presentToast({
        message: 'Redirecting to Google...',
        duration: 2000,
        position: 'top',
        color: 'success'
      });

      // NOTE: Supabase redirects, so the route push may not be reached.
      router.push('/it35-lab/app', 'forward', 'replace');

    } catch (error: any) {
      await presentToast({
        message: error.message || 'Google login failed',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      console.error('Google login error:', error);
    }
  };

  return (
    <IonButton 
      expand="block" 
      onClick={handleGoogleLogin}
      fill="outline"
      className="google-login-button"
    >
      <IonIcon 
        slot="start" 
        icon={logoGoogle} 
        className="google-icon"
      />
      Continue with Google
    </IonButton>
  );
};

export default GoogleLoginButton;
