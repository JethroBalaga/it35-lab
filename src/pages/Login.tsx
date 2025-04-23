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

const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onClose}
      header="Notification"
      message={message}
      buttons={['OK']}
    />
  );
};

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

  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
  
    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }
  
    // Get logged-in user data (user id is required for the table)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.email || !user?.id) {
      setAlertMessage("Error fetching user data.");
      setShowAlert(true);
      return;
    }
  
    // Fetch OTP status for the user
    const { data: otpSettings, error: otpError } = await supabase
      .from('user_otp_settings')
      .select('otp_status, otp_code')
      .eq('email', user.email)
      .single();
  
    if (otpError) {
      setAlertMessage("Error fetching OTP status.");
      setShowAlert(true);
      return;
    }
  
    if (otpSettings && otpSettings.otp_status) {
      // OTP is enabled, generate and send OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  
      // Upsert (insert or update) OTP record with user.id, email, and generated otp_code
      const { error: upsertError } = await supabase
        .from('user_otp_settings')
        .upsert({
          id: user.id,  // Use the user id here
          email: user.email,
          otp_code: generatedOtp,
          otp_status: true  // Ensure OTP is enabled
        });
  
      if (upsertError) {
        setAlertMessage("Error storing OTP.");
        setShowAlert(true);
        return;
      }
  
      // TODO: Send OTP via email (integrate email service here)
      
  
      // Open OTP modal
      setOtpModalOpen(true);
    } else {
      // OTP is disabled, proceed to the main page
      setShowToast(true);
      setTimeout(() => {
        navigation.push('/it35-lab/app', 'forward', 'replace');
      }, 300);
    }
  };
  
  const verifyOtp = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email || otpCode.length !== 6) {
      setAlertMessage("Please enter a valid OTP code.");
      setShowAlert(true);
      return;
    }

    // Fetch the stored OTP for the user
    const { data: otpSettings, error } = await supabase
      .from('user_otp_settings')
      .select('otp_code')
      .eq('email', user.email)
      .single();

    if (error || !otpSettings) {
      setAlertMessage("Error verifying OTP.");
      setShowAlert(true);
      return;
    }

    if (otpSettings.otp_code === otpCode) {
      // OTP is correct, redirect to the main page and remove OTP code
      await supabase
        .from('user_otp_settings')
        .update({ otp_code: null })
        .eq('email', user.email);

      setOtpModalOpen(false);
      setShowToast(true);
      setTimeout(() => {
        navigation.push('/it35-lab/app', 'forward', 'replace');
      }, 300);
    } else {
      // OTP is incorrect
      setAlertMessage("Invalid OTP code. Please try again.");
      setShowAlert(true);
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
          marginTop: '25%'
        }}>
          <IonAvatar
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden'
            }}
          >
            <IonIcon
              icon={logoIonic}
              color='primary'
              style={{ fontSize: '120px', color: '#6c757d' }}
            />
          </IonAvatar>
          <h1 style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>USER LOGIN</h1>
          <IonInput
            label="Email"
            labelPlacement="floating"
            fill="outline"
            type="email"
            placeholder="Enter Email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
          />
          <IonInput style={{ marginTop: '10px' }}
            fill="outline"
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
          >
            <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
          </IonInput>
        </div>
        <IonButton onClick={doLogin} expand="full" shape='round'>
          Login
        </IonButton>

        <IonButton routerLink="/register" expand="full" fill="clear" shape='round'>
          Don't have an account? Register here
        </IonButton>

        {/* Reusable AlertBox Component */}
        <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

        {/* IonToast for success message */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Login successful! Redirecting..."
          duration={1500}
          position="top"
          color="primary"
        />

        {/* OTP Modal */}
        <IonModal isOpen={otpModalOpen}>
          <IonContent className="ion-padding">
            <h2>Enter OTP</h2>
            <IonInput
              type="number"
              placeholder="Enter OTP Code"
              value={otpCode}
              onIonChange={e => setOtpCode(e.detail.value!)}
              maxlength={6}
            />
            <IonButton onClick={verifyOtp} expand="full" shape="round">
              Verify OTP
            </IonButton>
            <IonButton onClick={() => setOtpModalOpen(false)} expand="full" fill="clear" shape="round">
              Cancel
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Loading spinner */}
        <IonLoading isOpen={isLoading} message="Please wait..." />
      </IonContent>
    </IonPage>
  );
};

export default Login;
