import { 
      IonContent, 
      IonHeader, 
      IonPage, 
      IonTitle, 
      IonToolbar 
  } from '@ionic/react';
  const Feed: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>          
            <IonTitle>Feed</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          Feed
        </div>
        </IonContent>
      </IonPage>
    );
  };
  export default Feed;