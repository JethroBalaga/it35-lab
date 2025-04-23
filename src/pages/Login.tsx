import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonToast,
  useIonRouter,
  IonModal,
  IonLoading
} from '@ionic/react';
import { logoIonic } from 'ionicons/icons';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpEmailSent, setOtpEmailSent] = useState('');

  const doLogin = async () => {
    setIsLoading(true);
    try {
      const { error, data: { user: authUser } } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      if (!authUser) throw new Error("User not found");

      // Get the full user object to ensure we have email
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError || new Error("User data unavailable");

      const userEmail = user.email || email; // Fallback to the email from input

      // Check OTP status
      const { data: otpSettings, error: otpError } = await supabase
        .from('user_otp_settings')
        .select('otp_status')
        .eq('id', user.id)
        .single();

      if (otpError || !otpSettings) {
        // No OTP required - direct login
        setShowToast(true);
        navigation.push('/it35-lab/app', 'forward', 'replace');
        return;
      }

      if (otpSettings.otp_status) {
        // Generate and "send" OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        const { error: otpUpdateError } = await supabase
          .from('user_otp_settings')
          .upsert({
            id: user.id,
            email: userEmail,
            otp_code: generatedOtp,
            otp_expires_at: expiresAt,
            updated_at: new Date().toISOString()
          });

        if (otpUpdateError) throw otpUpdateError;

        setOtpEmailSent(userEmail); // Now using the properly obtained email
        setOtpModalOpen(true);
      } else {
        // OTP not enabled - direct login
        setShowToast(true);
        navigation.push('/it35-lab/app', 'forward', 'replace');
      }
    } catch (error: any) {
      setAlertMessage(error.message || "Login failed");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Session expired");

      const { data: otpData, error: otpError } = await supabase
        .from('user_otp_settings')
        .select('otp_code, otp_expires_at')
        .eq('id', user.id)
        .single();

      if (otpError || !otpData?.otp_code) throw new Error("Invalid OTP");

      // Check if OTP matches and is not expired
      if (otpData.otp_code !== otpCode) throw new Error("Incorrect OTP");
      if (new Date(otpData.otp_expires_at) < new Date()) throw new Error("OTP expired");

      // Clear OTP after successful verification
      await supabase
        .from('user_otp_settings')
        .update({ otp_code: null, otp_expires_at: null })
        .eq('id', user.id);

      setShowToast(true);
      setOtpModalOpen(false);
      navigation.push('/it35-lab/app', 'forward', 'replace');
    } catch (error: any) {
      setAlertMessage(error.message || "OTP verification failed");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className='ion-padding'>
        <div className="ion-text-center ion-margin-top">
          <IonAvatar style={{ width: '150px', height: '150px', margin: '0 auto' }}>
            <IonIcon icon={logoIonic} style={{ fontSize: '120px', color: '#6c757d' }} />
          </IonAvatar>
          <h1>USER LOGIN</h1>

          <IonInput
            label="Email"
            labelPlacement="floating"
            fill="outline"
            type="email"
            placeholder="Enter Email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
            className="ion-margin-bottom"
          />

          <IonInput
            label="Password"
            labelPlacement="floating"
            fill="outline"
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            className="ion-margin-bottom"
          >
            <IonInputPasswordToggle slot="end" />
          </IonInput>

          <IonButton
            onClick={doLogin}
            expand="block"
            shape="round"
            className="ion-margin-bottom"
          >
            Login
          </IonButton>

          <IonButton
            routerLink="/register"
            expand="block"
            fill="clear"
            shape="round"
          >
            Don't have an account? Register here
          </IonButton>
        </div>

        {/* OTP Modal */}
        <IonModal isOpen={otpModalOpen} onDidDismiss={() => setOtpModalOpen(false)}>
          <IonContent className="ion-padding">
            <div className="ion-text-center">
              <h2>OTP Verification</h2>

              {/* This will close modal AND keep routerLink navigation */}
              <IonButton
                routerLink="/otp"
                onClick={() => setOtpModalOpen(false)}
                expand="block"
                className="ion-margin-bottom"
              >
                Go to OTP Page
              </IonButton>

              {/* Manual OTP Entry */}
              <IonInput
                value={otpCode}
                placeholder="Enter 6-digit OTP"
                onIonChange={e => setOtpCode(e.detail.value!)}
              />

              <IonButton onClick={verifyOtp} expand="block">
                Verify OTP
              </IonButton>

              <IonButton
                onClick={() => setOtpModalOpen(false)}
                expand="block"
                fill="clear"
              >
                Cancel
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Error"
          message={alertMessage}
          buttons={['OK']}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Login successful! Redirecting..."
          duration={1500}
          color="success"
        />

        <IonLoading isOpen={isLoading} message="Processing..." />
      </IonContent>
    </IonPage>
  );
};

export default Login;