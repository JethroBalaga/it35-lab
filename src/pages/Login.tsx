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
import logos from '../images/skull-3471134_1280.webp';
import background from '../images/vcs.gif';
import ReCAPTCHA from 'react-google-recaptcha';
import GoogleLoginButton from '../components/GoogleLoginButton';
import OtpPage from './OtpPage';

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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const doLogin = async () => {
    if (!captchaToken) {
      setAlertMessage("Please complete the CAPTCHA.");
      setShowAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Attempt authentication FIRST
      const { error, data: { user: authUser } } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!authUser) throw new Error("Authentication failed");

      // 2. Create successful login attempt record
      const { error: attemptError } = await supabase
        .from('login_attempts')
        .insert({
          user_id: authUser.id,
          email: email,
          success: true,
          // created_at is automatically set by DEFAULT NOW()
        });

      if (attemptError) throw attemptError;

      // 3. Proceed with post-login flow
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError || new Error("User data unavailable");

      // Check admin status
      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('user_email', user.email)
        .single();

      if (userData?.is_admin) {
        navigation.push('/it35-lab/adminroute', 'forward', 'replace');
        return;
      }

      // OTP handling
      const userEmail = user.email || email;
      const { data: otpSettings, error: otpError } = await supabase
        .from('user_otp_settings')
        .select('otp_status')
        .eq('id', user.id)
        .single();

      if (otpError || !otpSettings) {
        setShowToast(true);
        navigation.push('/it35-lab/app', 'forward', 'replace');
        return;
      }

      if (otpSettings.otp_status) {
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        const { error: otpUpdateError } = await supabase
          .from('user_otp_settings')
          .upsert({
            id: user.id,
            email: userEmail,
            otp_code: generatedOtp,
            otp_expires_at: expiresAt
          });

        if (otpUpdateError) throw otpUpdateError;

        setOtpEmailSent(userEmail);
        setOtpModalOpen(true);
      } else {
        setShowToast(true);
        navigation.push('/it35-lab/app', 'forward', 'replace');
      }

    } catch (error: any) {
      console.error("Login failed:", error);
      setAlertMessage(error.message || "Login failed");
      setShowAlert(true);

      // Create failed attempt record
      await supabase
        .from('login_attempts')
        .insert({
          email: email,
          success: false,
          error_message: error.message
          // created_at is automatically set
        });
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
      if (otpData.otp_code !== otpCode) throw new Error("Incorrect OTP");
      if (new Date(otpData.otp_expires_at) < new Date()) throw new Error("OTP expired");

      await supabase
        .from('user_otp_settings')
        .update({ otp_code: null, otp_expires_at: null })
        .eq('user.id', user.id);

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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '10%'
        }}></div>

        <img
          src={background}
          alt="background"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        />

        <div className="ion-text-center ion-margin-top">
          <img
            src={logos}
            alt="Logo"
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'contain',
              margin: '0 auto',
              display: 'block',
              marginBottom: '1rem',
            }}
          />

          <h1>USER LOGIN</h1>

          <IonInput
            style={{ textAlign: 'left' }}
            label="Email"
            labelPlacement="floating"
            fill="outline"
            type="email"
            placeholder="Enter Email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
            className="ion-margin-bottom"
            color={"tertiary"}
          />

          <IonInput
            style={{ textAlign: 'left' }}
            label="Password"
            labelPlacement="floating"
            fill="outline"
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            className="ion-margin-bottom"
            color={"tertiary"}
          >
            <IonInputPasswordToggle slot="end" />
          </IonInput>

          {/* CAPTCHA */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '1rem 0'
            
          }}>
            <ReCAPTCHA
              sitekey="6Lft2korAAAAADcz_DZh9YkwJMJsYvxvViKbX4ma"
              onChange={token => setCaptchaToken(token)}
              className="ion-margin-bottom"
            />
          </div>

          <GoogleLoginButton />

          <IonButton
            onClick={doLogin}
            expand="block"
            shape="round"
            className="ion-margin-bottom"
            color={"tertiary"}
          >
            Login
          </IonButton>

          <IonButton
            routerLink="/register"
            expand="block"
            fill="clear"
            shape="round"
            color={"tertiary"}
          >
            Don't have an account? Register here
          </IonButton>
        </div>

        {/* OTP Modal */}

        <IonModal isOpen={otpModalOpen} onDidDismiss={() => setOtpModalOpen(false)}>
          <IonContent className="ion-padding">
            <div className="ion-text-center">
              <h2>OTP Verification</h2>
              <p>We've sent a 6-digit code to {otpEmailSent}</p>

              <IonButton routerLink="/otp" routerDirection="back" color="primary">
                Go to OTP page
              </IonButton>

              <IonInput
                value={otpCode}
                placeholder="Enter 6-digit OTP"
                onIonChange={e => setOtpCode(e.detail.value!)}
                className="ion-margin-bottom"
              />

              <IonButton
                onClick={verifyOtp}
                expand="block"
                className="ion-margin-bottom"
              >
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