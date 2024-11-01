const DiagnosticComponent = () => {
    // Function to check if the endpoint exists and accepts POST requests
    const checkEndpoint = async () => {
      try {
        // First, try an OPTIONS request to check CORS and available methods
        console.log('Checking endpoint with OPTIONS...');
        const optionsResponse = await fetch('https://server1kingmaker.netlify.app/imagehost/persistimagedata', {
          method: 'OPTIONS'
        });
        console.log('OPTIONS response:', {
          status: optionsResponse.status,
          headers: Object.fromEntries(optionsResponse.headers.entries())
        });
  
        // Then try a direct POST request to check if the endpoint exists
        console.log('Attempting direct POST request...');
        const postResponse = await fetch('https://server1kingmaker.netlify.app/imagehost/persistimagedata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            test: true,
            timestamp: new Date().toISOString()
          })
        });
        
        console.log('POST response:', {
          status: postResponse.status,
          headers: Object.fromEntries(postResponse.headers.entries())
        });
  
        if (!postResponse.ok) {
          const errorText = await postResponse.text();
          console.error('Error response body:', errorText);
        }
  
      } catch (error) {
        console.error('Endpoint check failed:', error);
      }
    };
  
    // Button to trigger the diagnostic check
    const handleCheckClick = () => {
      checkEndpoint();
    };
  
    return (
      <button onClick={handleCheckClick}>
        Check Endpoint
      </button>
    );
  };