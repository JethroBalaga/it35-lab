import { 
  IonButtons,
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonAvatar,
  IonItem,
  IonLabel
} from '@ionic/react';

const Feed: React.FC = () => {
  const posts = [
      {
          id: 1,
          username: "Lester_the_gangster",
          userAvatar: "C:\Users\Jethro Balaga\Documents\it35-lab\public\images\lester.jpg",
          title: "Kaya ko ni ba haha",
          videoUrl: "https://www.youtube.com/embed/pVciO8dazq4",
          description: "Top 10 layouts from the 2022 AUDL season."
      },
      {
          id: 2,
          username: "bruce_lee",
          userAvatar: "C:\Users\Jethro Balaga\Documents\it35-lab\images\Winston lee.jpg",
          title: "Kini muy sumbagay!!!",
          videoUrl: "https://www.youtube.com/embed/AExV-_oQVuc",
          description: "Street Beefs."
      },
      {
          id: 3,
          username: "papi_Chupapi",
          userAvatar: "C:\Users\Jethro Balaga\Documents\it35-lab\images\chulo.jpg",
          title: "greatest flop haha",
          videoUrl: "https://www.youtube.com/embed/q8vpW41GkjQ",
          description: "Ball si Life."
      }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Feed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '10px' }}>
          {posts.map(post => (
            <IonCard key={post.id} style={{ width: '100%', maxWidth: '400px', borderRadius: '20px', overflow: 'hidden' }}>
              <IonItem>
                <IonAvatar slot="start">
                  <img src={post.userAvatar} alt="User Avatar" />
                </IonAvatar>
                <IonLabel>{post.username}</IonLabel>
              </IonItem>
              <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                <iframe 
                  src={post.videoUrl} 
                  title={post.title} 
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '20px' }}
                ></iframe>
              </div>
              <IonCardHeader>
                <IonCardTitle>{post.title}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {post.description}
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Feed;
