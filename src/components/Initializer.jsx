import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

const Initializer = () => {

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const generateUUID = () => {
        return uuidv4()
    }

    const [base64Images, setBase64Images] = useState([]);

    const [allExistingBase64Images, setAllExistingBase64Images] = useState([]);

    //test links
    //may have to prepend https:// to all urls
    const webpForFootwear = ["https://images.asos-media.com/products/bershka-baggy-carpenter-casted-jean-in-green/206170024-1-green", "https://images.asos-media.com/products/asos-design-oversized-heavyweight-t-shirt-in-washed-khaki-with-chest-print/205462648-1-mermaid"]
    const webpForAccessories = ["https://images.asos-media.com/products/asos-design-oversized-embroidery-bomber-jacket-in-khaki/205494564-1-khaki", "https://images.asos-media.com/products/parlez-nylon-rain-jacket-in-burnt-orange/205792473-1-red"]
    const webpForCoatsandjackets = ["https://images.asos-media.com/products/parlez-nylon-rain-jacket-in-burnt-orange/205792473-1-red", "https://images.asos-media.com/products/bershka-baggy-carpenter-casted-jean-in-green/206170024-1-green"]

    const getURLs = [webpForFootwear, webpForAccessories, webpForCoatsandjackets];
    
    

    const [fetchedImageData, setFetchedImageData] = useState({

        base64DTO: {
            eventID: '',
            date: '',
            supplier: '',
            imageType: '',
            imageData: {
                footwearURLs: [],
                footwear64s: [],
                accessoriesURLs: [],
                accessories64s: [],
                coatsandjacketsURLs: [],
                coatsandjackets64s: []
            }

        }

    });

    const handleFileChange = async () => {
        
        // try {
           
        //     const response = await fetch('', {

        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
              
        //     });
    
        //     if (!response.ok) {
              
        //       setIsError(true);
              
        //     } else {

        //         getURLs = response.json()
        //         console.log(getURLs)

        //     }

        // } catch (error) {

        //     setIsError(true);
        //     console.log(error);

        // }

        // setIsLoading(false);

        //this will go in the else and be set using the response data - should be in blob format convert from webp to blob in last job

        // Function to fetch image data from URLs, convert to blobs and push into arrays
        const fetchAndPushBlobs = async (urls, blobArray) => {
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
               
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image from URL: ${url}`);
                    }

                    const blob = await response.blob();
                    blobArray.push(blob);

                } catch (error) {
                    console.error(error);
                }
            }
        };

        // Define arrays for blobs
        let blob1 = []; //represents footwear
        let blob2 = []; //represents accessories
        let blob3 = []; //represents coatsandjackets

        // Fetch image data for each URL array and push blobs into respective arrays
        await Promise.all([

            fetchAndPushBlobs(getURLs[0], blob1),
            fetchAndPushBlobs(getURLs[1], blob2),
            fetchAndPushBlobs(getURLs[2], blob3)

        ]);

        console.log(blob1)
        console.log(blob2)
        console.log(blob3)

        // // Function to convert Blob to array
        // const blobToArray = async (blob) => {
        //     return new Promise((resolve, reject) => {
        //         const reader = new FileReader();

        //         reader.onload = () => {
        //             const array = new Uint8Array(reader.result);
        //             resolve(Array.from(array));
        //         };

        //         reader.onerror = () => {
        //             reject(new Error('Failed to read the blob as an array'));
        //         };

        //         reader.readAsArrayBuffer(blob);
        //     });
        // };

        // // Convert blobs to arrays
        // const array1 = await Promise.all(blob1.map(blob => blobToArray(blob)));
        // const array2 = await Promise.all(blob2.map(blob => blobToArray(blob)));
        // const array3 = await Promise.all(blob3.map(blob => blobToArray(blob)));

        // console.log('Array 1:', array1);
        // console.log('Array 2:', array2);
        // console.log('Array 3:', array3);

        fetchedImageData.base64DTO.eventID = 'set from response object'
        fetchedImageData.base64DTO.date = '2024-03-20T13:04:59.783Z' //'set from response object'
        fetchedImageData.base64DTO.supplier = 'set from response object'
        fetchedImageData.base64DTO.imageType = blob1[0].type
        fetchedImageData.base64DTO.imageData.footwearURLs = blob1
        fetchedImageData.base64DTO.imageData.accessoriesURLs = blob2
        fetchedImageData.base64DTO.imageData.coatsandjacketsURLs = blob3

        console.log(fetchedImageData)

        //Function to convert blobs to base64 using FileReader
        const blobsToBase64 = async (blobs) => {
            const base64Array = [];
            for (const blob of blobs) {
            // Create a FileReader object
            const reader = new FileReader();
            // Wrap FileReader in a Promise
            const base64Promise = new Promise((resolve, reject) => {
                // Set up the onloadend event handler to convert blob to base64
                reader.onloadend = () => {
                // Resolve the promise with the base64 data
                resolve(reader.result);
                };
                // Set up error handling for FileReader
                reader.onerror = (error) => {
                reject(error);
                };
                // Read the blob data as a data URL (base64)
                reader.readAsDataURL(blob);
            });
            // Wait for the promise to resolve and push the base64 data into base64Array
            base64Array.push(await base64Promise);
            }
            return base64Array;
        };        
        
        // Call the function to convert blobs into array of base64
        const conversionFootwearArray = await blobsToBase64(fetchedImageData.base64DTO.imageData.footwearURLs);
        console.log(conversionFootwearArray);

        // Call the function to convert blobs into array of base64
        const conversionAccessoriesArray = await blobsToBase64(fetchedImageData.base64DTO.imageData.accessoriesURLs);
        console.log(conversionAccessoriesArray);
        
        // Call the function to convert blobs into array of base64
        const conversionCoatsandjacketsArray = await blobsToBase64(fetchedImageData.base64DTO.imageData.coatsandjacketsURLs);
        console.log(conversionCoatsandjacketsArray);
        
        //Display images in array on UI - set display size of each in return statement
        setBase64Images([...conversionFootwearArray, ...conversionAccessoriesArray, ...conversionCoatsandjacketsArray]);     

        //Set data to be posted
        fetchedImageData.base64DTO.imageData.footwear64s = conversionFootwearArray
        fetchedImageData.base64DTO.imageData.accessories64s = conversionAccessoriesArray
        fetchedImageData.base64DTO.imageData.coatsandjackets64s = conversionCoatsandjacketsArray

    }

    const getScrapingURLs = ``

    const persistURLs = `http://localhost:9100/imagehost/persistimagedata` 
    //const persistURLs = `https://image-host-je09.onrender.com/imagehost/persistimagedata`

    //Only sends base64s not URLs
    const handleSubmit = async (event) => {

        event.preventDefault();

        setIsLoading(true);
        setIsError(false);
     
        //get request is requeired to fetch the scraping data

        try {

            await handleFileChange();

            const footwear64s = fetchedImageData.base64DTO.imageData.footwear64s;

            // Iterate through the array and process each item
            const footwearStringList = footwear64s.map(item => {
              // Split the item by ',' and take the last part
              const base64ImageData = item.split(',').pop();
              //console.log(base64ImageData)
              return base64ImageData;
            });

            const accessories64s = fetchedImageData.base64DTO.imageData.accessories64s;

            // Iterate through the array and process each item
            const accessoriesStringList = accessories64s.map(item => {
              // Split the item by ',' and take the last part
              const base64ImageData = item.split(',').pop();
              return base64ImageData;
            });

            const coatsandjackets64s = fetchedImageData.base64DTO.imageData.coatsandjackets64s;

            // Iterate through the array and process each item
            const coatsandjacketsStringList = coatsandjackets64s.map(item => {
              // Split the item by ',' and take the last part
              const base64ImageData = item.split(',').pop();
              return base64ImageData;
            });

            console.log(footwearStringList.length)
            console.log(accessoriesStringList.length)
            console.log(coatsandjacketsStringList.length)

            const collectionOfImagesAndEventData = {

                eventID: fetchedImageData.base64DTO.eventID,
                date: fetchedImageData.base64DTO.date,
                supplier: fetchedImageData.base64DTO.supplier,
                imageType: fetchedImageData.base64DTO.imageType,
                footwear64s: footwearStringList,
                accessories64s: accessoriesStringList,
                coatsandjackets64s: coatsandjacketsStringList

            }

            console.log(JSON.stringify(collectionOfImagesAndEventData))
            //console.log(collectionOfImagesAndEventData)

            const response = await fetch(persistURLs, {

                method: 'POST',
                headers: {
    
                    'Content-Type': 'application/json',
    
                },
                
                body: JSON.stringify(collectionOfImagesAndEventData)
              
            });
    
            if (!response.ok) {
              
              setIsError(true);
              
            } else {

                const data = response.toString();
                console.log(data)
                console.log(response.status)  

            }


        } catch (error) {

                setIsError(true);
                console.log(error);
    
        }
    
            setIsLoading(false); 

    }

    const renderImage = (base64Strings) => {
          
        setAllExistingBase64Images([...base64Strings]);  

    }

    const getAllImages = `http://localhost:9100/imagehost/getallimages`
   
    const displayAllImages = async (event) => {

        event.preventDefault()

        setIsLoading(true);
        setIsError(false);

        try {

            const response = await fetch(getAllImages, {

                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                }

            });

            if(!response.ok){

                setIsError(true);

            } else {

                const images = await response.json()
                console.log(images)
                renderImage(images)

            }

        } catch(error){

            setIsError(true);
            console.log(error);

        }

        setIsLoading(false); 
    
    }


    return(

        <div> 
            
            <h1>User Interface</h1>
            
            {/* Display converted images */}
            <div>
                {isLoading && <div>Loading...</div>}
                {isError && <div>Error getting or posting images</div>}
                <button type="submit" onClick={handleSubmit}>Post Content</button>
                <h2>Images that were posted to instagram</h2>
                {base64Images.map((base64, index) => (
                <img key={index} src={base64} alt={`Converted Image ${index + 1}`} />
                ))}
            </div>

            <div>
                {isLoading && <div>Loading...</div>}
                {isError && <div>Error fetching images</div>}
                <button type="submit" onClick={displayAllImages}>Get All Images</button>
                <h2>Images that exist in the database</h2>
                <div  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'  }}>
                    {allExistingBase64Images.map((base64String, index) => (
                        <div key={index} >
                            <img src={`data:image/jpeg;base64,${base64String}`} alt={`Image ${index}`} style={{ width: '50%' }}/>
                        </div>
                    ))}
                </div>
            </div>

            

        </div>
  
    )

}

export default Initializer;