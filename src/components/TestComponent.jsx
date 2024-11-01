const TestComponent = () => {
    // Test function to verify proxy is working with POST requests
    const testEndpoint = async () => {
      try {
        console.log('Starting test POST request...');
        
        const response = await fetch('/api/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            test: 'data',
            timestamp: new Date().toISOString() 
          })
        });
        
        console.log('Test response status:', response.status);
        
        const data = await response.json();
        console.log('Test response data:', data);
        
        return data;
      } catch (error) {
        console.error('Test request failed:', error);
        throw error;
      }
    };
  
    // Button to trigger the test
    const handleTestClick = async () => {
      try {
        const result = await testEndpoint();
        console.log('Test completed successfully:', result);
      } catch (error) {
        console.error('Test failed:', error);
      }
    };
  
    return (
      <button onClick={handleTestClick}>
        Test Proxy
      </button>
    );
  };