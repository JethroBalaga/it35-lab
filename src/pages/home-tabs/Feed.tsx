import { 
      IonContent, 
      IonHeader, 
      IonPage, 
      IonTitle, 
      IonToolbar 
  } from '@ionic/react';
  import FeedContainer from '../../components/FeedContainer';
  const Feed: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>          
            <IonTitle color='danger'>Feed</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
      
        <FeedContainer />
        </IonContent>
      </IonPage>
    );
  };
  export default Feed;