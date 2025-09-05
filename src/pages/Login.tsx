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
  useIonRouter
} from '@ionic/react';
import { logoIonic } from 'ionicons/icons';
import { useState,useEffect} from 'react';
import { supabase } from '../utils/supabaseClient';
import logos from '../images/Valorant2.png';
import background from '../images/DL_Tease_16x9_v1.jpg';
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

const h1Style = {
  color: 'Black',
   '--ion-color-primary': 'red',
   '--custom-hover-input': 'red',
};

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }

    setShowToast(true);
    setTimeout(() => {
      navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 300);
  };

  return (
    <IonPage>
      <IonContent className='ion-padding'  >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '25%'
        }}>
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
            
            <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem', // adds spacing between inputs
                  marginTop: '2rem',
                }}
              />

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


          <h1 style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color:'red'
          }}>USER LOGIN</h1>
          <IonInput
            className="custom-hover-input"
            label="Email"
            labelPlacement="floating"
            fill="outline"
            type="email"
            placeholder="Enter Email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
            style={h1Style}
          />
          <IonInput style={{marginTop: '10px',color:'black', '--ion-color-primary': 'red'}}
            fill="outline"
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
          >
            <IonInputPasswordToggle slot="end" color='danger'></IonInputPasswordToggle>
          </IonInput>
        </div>
        <IonButton onClick={doLogin} expand="full" shape='round' color='danger'>
          Login
        </IonButton>

        <IonButton routerLink="/register" expand="full" fill="clear" shape='round' color='danger'>
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
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;