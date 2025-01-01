function NotFound() {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
         
          <h1 style={styles.title}>404 - Page Not Found</h1>
          <p style={styles.message}>Oops! Looks like this page swam away.</p>
        </div>
      </div>
    );
  }
  
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: '#333',
      textAlign: 'center' as const, 
    },
    content: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      padding: '20px',
     
      maxWidth: '400px',
    },
    icon: {
      width: '80px',
      marginBottom: '20px',
    },
    title: {
      fontSize: '2.5rem',
      marginBottom: '10px',
      color: '#0077b6',
    },
    message: {
      fontSize: '1.25rem',
      marginBottom: '20px',
      color: '#555',
    },
    button: {
      padding: '10px 20px',
      fontSize: '1rem',
      backgroundColor: '#0096c7',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
  };
  
  export default NotFound;