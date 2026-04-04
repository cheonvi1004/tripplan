import { useEffect, useState } from 'react';

function Footer() {
  const [visitorCount, setVisitorCount] = useState('-');

  useEffect(() => {
    // Load Firebase scripts
    const appScript = document.createElement('script');
    appScript.src = 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js';
    appScript.onload = () => {
      const dbScript = document.createElement('script');
      dbScript.src = 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database-compat.js';
      dbScript.onload = initFirebase;
      document.head.appendChild(dbScript);
    };
    document.head.appendChild(appScript);

    function initFirebase() {
      if (typeof firebase === 'undefined') return;

      const firebaseConfig = {
        apiKey: "AIzaSyDemo123456789",
        authDomain: "tripplan-993e5.firebaseapp.com",
        databaseURL: "https://tripplan-993e5-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "tripplan-993e5",
        storageBucket: "tripplan-993e5.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abc123"
      };

      try {
        firebase.initializeApp(firebaseConfig);
        const cntRef = firebase.database().ref('tripplan/count');

        cntRef.transaction(c => ((c || 0) + 1));

        cntRef.on('value', (snap) => {
          const n = snap.val() || 0;
          setVisitorCount(n.toLocaleString() + ' 명');
        });
      } catch (e) {
        console.log('Firebase not configured');
      }
    }
  }, []);

  return (
    <footer>
      <p>여행 코스 메이커 &nbsp;·&nbsp; 무료로 누구나 사용 가능 &nbsp;·&nbsp; 데이터는 브라우저에서만 처리됩니다</p>
      <p style={{ marginTop: 6, fontSize: 11, color: 'var(--text3)' }}>© 2026 codinghanjan All Rights Reserved.</p>
      <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text2)' }}>👤 방문자 수: {visitorCount}</p>
    </footer>
  );
}

export default Footer;
