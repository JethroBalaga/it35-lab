import { 
  IonButtons,
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonSearchbar 
} from '@ionic/react';
import { useState } from 'react';

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  return (
      <IonPage>
          <IonHeader>
              <IonToolbar>
                  <IonButtons slot='start'>
                      <IonMenuButton></IonMenuButton>
                  </IonButtons>
                  <IonTitle>Search</IonTitle>
              </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
              <IonSearchbar 
                  value={searchText} 
                  onIonInput={(e) => setSearchText(e.detail.value!)} 
                  placeholder="Search here..."
              ></IonSearchbar>
              <div
                  style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                  }}
              >
                  Search
              </div>
          </IonContent>
      </IonPage>
  );
};

export default Search;
