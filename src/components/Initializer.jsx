import React, { useState } from "react";
//import { v4 as uuidv4 } from 'uuid';
import TableComponent from "./TableComponent";

const Initializer = ({data}) => {

    //console.log(data)

    //const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoadingGetAll, setIsLoadingGetAll] = useState(false);
    const [isErrorGetAll, setIsErrorGetAll] = useState(false);
    const [isLoadingGetData, setIsLoadingGetData] = useState(false);
    const [isErrorGetData, setIsErrorGetData] = useState(false);
    // let shortUrl = "";
    //let [longUrl, setLongUrl] = useState('');

    // const generateUUID = () => {
    //     return uuidv4()
    // }

    const [dataFromDB, setDataFromDB] = useState([]);

    const [base64Images, setBase64Images] = useState([]);

    const [allExistingBase64Images, setAllExistingBase64Images] = useState([]);

    //Arrays to separate categories from csv data
    const webpForFootwear = []
    const webpForAccessories = []
    const webpForCoatsandjackets = []

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
                coatsandjackets64s: [],
                footwearCaptions: [], 
                accessoriesCaptions: [], 
                coatsandjacketsCaptions: [],
                productFootwearURLs: [],
                productAccessoriesURLs: [],
                productCoatsAndJacketsURLs: []   
            },
            affiliateLink: []

        }

    });

    // Function to convert the URL
    // const convertUrl = (originalUrl) => {
    //     // Split the original URL by '/'
    //     const parts = originalUrl.split('/');

    //     // Remove the first three elements ('asos-design', 'asos-design', 'asos-design-oversized-faux-leather-motocross-jacket-in-monochrome')
    //     const newPath = parts.slice(1).join('/');

    //     // Construct the new URL
    //     const newUrl = `asos.com/${newPath}`;

    //     return newUrl;
    // }

    // const shortenUrlWithTinyUrl = async () => {

    //     const token = "jpmceHAtOayQ2nl4umuaPH6SEO70wLPWqfOiSXcRCLIBCmab9cJJkZaX2GzS"

    //     try {

    //         const encodedUrl = encodeURIComponent(longUrl);
    //         //const response = await axios(`https://tinyurl.com/api-create.php?url=${encodedUrl}`);   
    //         // const response = await axios.post('https://tinyurl.com/openapi/v2.json/create', {
    //         //     params: {
    //         //         url: longUrl,
    //         //         domain: "tinyurl.com",
    //         //         alias: "myexamplelink",
    //         //         tags: "example,link",
    //         //         expires_at: "2024-10-25 10:11:12",
    //         //         description: "string"
    //         //       },
    //         //   });  
    //         const response = await axios.patch(
    //             'https://api.tinyurl.com/change',
    //             {
    //               url: longUrl,
    //               domain: 'tinyurl.com',
    //               alias: 'example-alias' // You can set an alias if needed, or remove this line
    //             },
    //             {
    //               headers: {
    //                 'accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authentication': `jpmceHAtOayQ2nl4umuaPH6SEO70wLPWqfOiSXcRCLIBCmab9cJJkZaX2GzS`, 
    //                 'Access-Control-Allow-Origin': 'http://localhost:3000'
    //               }
    //             }
    //           );
            

              
            
    //         console.log(response.status)
    //         if (response.status === 200) {
    //             shortUrl = response.data;
    //             setError('');
    //             console.log(shortUrl)
    //         } else {
    //             setError(`Error: ${response.status}`);
    //             console.log(error)
    //         }
            
    //     } catch (error) {
    //       setError(`Error: ${error.message}`);
    //       console.log(error)
    //     }
    // };

    const handleFileChange = async () => {

        //Fetch URLs and product descriptions from csv file and add to separate category arrays
        for(let i = 0; i < data.length; i++){
            if(data[i]["ProductType"] === "footwear"){
                webpForFootwear.push(`${data[i]["ImageURL"]}`)
                fetchedImageData.base64DTO.imageData.footwearCaptions.push(`${data[i]["Name"]}`)
                fetchedImageData.base64DTO.imageData.productFootwearURLs.push(`${data[i]["ProductURL"]}`)
                setFetchedImageData(fetchedImageData.base64DTO.affiliateLink.push(`${data[i]["AffiliateLink"]}`))
            } else if(data[i]["ProductType"] === "accessories"){
                webpForAccessories.push(`${data[i]["ImageURL"]}`);
                fetchedImageData.base64DTO.imageData.accessoriesCaptions.push(`${data[i]["Name"]}`)
                fetchedImageData.base64DTO.imageData.productAccessoriesURLs.push(`${data[i]["ProductURL"]}`)
                setFetchedImageData(fetchedImageData.base64DTO.affiliateLink.push(`${data[i]["AffiliateLink"]}`))
                //console.log(data[i]["AffiliateLink"])
                //console.log(`${data[i]["AffiliateLink"]}`)
                //longUrl = convertUrl("https://www.asos.com/asos-design/asos-design-wide-chino-shorts-in-shorter-length-in-tan/prd/204458642?ctaref=featured+product&featureref1=featured+product&#colourWayId-204458644")//longUrl = data[i]["ProductURL"]
                //console.log(longUrl)
                //shortenUrlWithTinyUrl();
                //console.log(shortUrl)
                //fetchedImageData.base64DTO.imageData.productAccessoriesURLs.push(longUrl)
            } else if(data[i]["ProductType"] === "coatsandjackets"){
                webpForCoatsandjackets.push(`${data[i]["ImageURL"]}`)
                fetchedImageData.base64DTO.imageData.coatsandjacketsCaptions.push(`${data[i]["Name"]}`)
                fetchedImageData.base64DTO.imageData.productCoatsAndJacketsURLs.push(`${data[i]["ProductURL"]}`)
                setFetchedImageData(fetchedImageData.base64DTO.affiliateLink.push(`${data[i]["AffiliateLink"]}`))
            } else {
                console.log(`${data[i]["ID"]} was not assigned a product type.`)
            }
        }
        console.log(webpForAccessories)
        console.log(data)

        // Function to convert URLs to blobs and push into arrays
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

        //Set fetchedImageData object with event data and blob arrays
        fetchedImageData.base64DTO.eventID = data[1]["EventID"] ? data[1]["EventID"] : "Event ID was null"

        // Convert the date string to a Date object
        const dateObject = new Date(data[1]["DateTime"]);

        // Format the date string
        const formattedDate = dateObject.toISOString();

        fetchedImageData.base64DTO.date = formattedDate
        fetchedImageData.base64DTO.supplier = data[1]["Supplier"] ? data[1]["Supplier"] : "Supplier was null"
        fetchedImageData.base64DTO.imageType = blob1[0]?.type ? blob1[0].type : "Image type was null"
        fetchedImageData.base64DTO.imageData.footwearURLs = blob1
        fetchedImageData.base64DTO.imageData.accessoriesURLs = blob2
        fetchedImageData.base64DTO.imageData.coatsandjacketsURLs = blob3

        console.log(fetchedImageData.base64DTO.affiliateLink)

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

    //const persistURLs = `http://localhost:9200/imagehost/persistimagedata` 
    //const persistURLs = `https://image-host-je09.onrender.com/imagehost/persistimagedata`
    //const persistURLs = `https://kingmakerimageserver.onrender.com/imagehost/persistimagedata`
    const persistURLs = `/api/imagehost/persistimagedata`

    //Only sends base64s not imageURLs
    const handleSubmit = async (event) => {

        event.preventDefault();

        setIsLoading(true);
        setIsError(false);

        try {

            await handleFileChange();

            const footwear64s = fetchedImageData.base64DTO.imageData.footwear64s;

            // Iterate through the array and process each item - remove initial part of base64
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

            // console.log(fetchedImageData.base64DTO.imageData.footwearCaptions)
            // console.log(fetchedImageData.base64DTO.imageData.accessoriesCaptions)
            // console.log(fetchedImageData.base64DTO.imageData.coatsandjacketsCaptions)

            const collectionOfImagesAndEventData = {

                eventID: fetchedImageData.base64DTO.eventID,
                date: fetchedImageData.base64DTO.date,
                supplier: fetchedImageData.base64DTO.supplier,
                imageType: fetchedImageData.base64DTO.imageType,
                footwear64s: footwearStringList,
                accessories64s: accessoriesStringList,
                coatsandjackets64s: coatsandjacketsStringList,
                footwearCaptions: fetchedImageData.base64DTO.imageData.footwearCaptions,
                accessoriesCaptions: fetchedImageData.base64DTO.imageData.accessoriesCaptions,
                coatsandjacketsCaptions: fetchedImageData.base64DTO.imageData.coatsandjacketsCaptions,
                productFootwearURLs: fetchedImageData.base64DTO.imageData.productFootwearURLs,
                productAccessoriesURLs: fetchedImageData.base64DTO.imageData.productAccessoriesURLs,
                productCoatsAndJacketsURLs: fetchedImageData.base64DTO.imageData.productCoatsAndJacketsURLs,
                affiliateLinks: fetchedImageData.base64DTO.affiliateLink

            }

            console.log(JSON.stringify(collectionOfImagesAndEventData))
            //console.log(collectionOfImagesAndEventData)

            const response = await fetch(persistURLs, {

                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
                
                body: JSON.stringify(collectionOfImagesAndEventData)
              
            });
    
            if (!response.ok) {
              
              setIsError(true);
              throw new Error(`HTTP error! status: ${response.status}`);
              
            } else {

                const data = response.json();
                console.log(data)
                console.log(response.status)  

            }

        } catch (error) {

            setIsError(true);
            console.log(error);
            console.error('Error uploading image:', error);
            throw error;
    
        }
    
            setIsLoading(false); 

    }

    const renderImage = (base64Strings) => {
          
        setAllExistingBase64Images([...base64Strings]);  

    }

    //const getAllImages = `http://localhost:9100/imagehost/getallimages`
    const getAllImages = `https://image-host-je09.onrender.com/imagehost/getallimages`
   
    const displayAllImages = async (event) => {

        event.preventDefault()

        setIsLoadingGetAll(true);
        setIsErrorGetAll(false);

        try {

            const response = await fetch(getAllImages, {

                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': ['http://localhost:3000', 'https://scraper-initializer.onrender.com']
                }

            });

            if(!response.ok){

                setIsErrorGetAll(true);

            } else {

                const images = await response.json()
                console.log(images)
                renderImage(images)

            }

        } catch(error){

            setIsErrorGetAll(true);
            console.log(error);

        }

        setIsLoadingGetAll(false); 
    
    }
    
    //const getAllData = `http://localhost:9100/imagehost/getallentries`
    const getAllData = `https://image-host-je09.onrender.com/imagehost/getallentries`

    const getDBData = async (event) => {

        event.preventDefault()

        setIsLoadingGetData(true)
        setIsErrorGetData(false)

        try {

            const response = await fetch(getAllData,{

                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': ['http://localhost:3000', 'https://scraper-initializer.onrender.com']
                }

            });

            if(!response.ok){
                setIsErrorGetData(true)
            } else {
                const data = await response.json()
                console.log(data)
                setDataFromDB(data)
            }

        } catch(error){
            setIsErrorGetData(true)
            console.log(error)
        }

        setIsLoadingGetData(false)

    }

    //const triggerURL = `http://localhost:9100/imagehost/selfservice`
    const triggerURL = `https://kingmakercontaineridserver.onrender.com/imagehost/receiveorderedimages`

    // Arrays to store timeout and interval IDs
    let timeoutIds = [];
    let intervalIds = [];

    // Function to calculate the delay until the next trigger time
    function getNextTriggerDelay(hours, minutes) {
        const now = new Date();
        const nextTrigger = new Date();
        
        nextTrigger.setHours(hours);
        nextTrigger.setMinutes(minutes);
        nextTrigger.setSeconds(0);
        nextTrigger.setMilliseconds(0);

        // If the next trigger time is in the past, set it for tomorrow
        if (nextTrigger <= now) {
            nextTrigger.setDate(nextTrigger.getDate() + 1);
        }

        return nextTrigger - now;
    }

    // Function to schedule the trigger at specific times
    function scheduleTriggers() {
        const triggerTimes = [
            { hours: 8, minutes: 0 },  // 8:00 AM
            { hours: 16, minutes: 0 }, // 4:00 PM
            { hours: 0, minutes: 0 }   // 12:00 AM
        ];

        triggerTimes.forEach(time => {
            const delay = getNextTriggerDelay(time.hours, time.minutes);
            const timeoutId = setTimeout(() => {
                triggerPosting();

                // Schedule subsequent triggers using setInterval
                const intervalId = setInterval(triggerPosting, 24 * 60 * 60 * 1000); // 24 hours
                intervalIds.push(intervalId);
            }, delay);

            // Store the timeout ID
            timeoutIds.push(timeoutId);
        });
    }

    // Function to stop all scheduled postings
    function endScheduling() {
        // Clear all timeouts
        timeoutIds.forEach(id => clearTimeout(id));
        timeoutIds = []; // Clear the array

        // Clear all intervals
        intervalIds.forEach(id => clearInterval(id));
        intervalIds = []; // Clear the array

        console.log('All scheduled postings have been stopped.');
    }

    // Function that performs the posting
    const triggerPosting = async () => {
        try {
            const response = await fetch(triggerURL, {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': ['http://localhost:3000', 'https://scraper-initializer.onrender.com'] // This header is not necessary in the request
                },
                body: null
            });

            if (!response.ok) {
                // Stop the scheduling if a non-2xx HTTP response is received
                endScheduling();

                // Handle non-2xx HTTP responses
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.text();
            console.log(data);

        } catch (error) {
            console.error('Error occurred while triggering posting:', error);
        }
    };

    // Start scheduling on startup
    scheduleTriggers();

    return(

        <div> 
            
            <h1>User Interface</h1>

            <div>
                <button type="submit" onClick={triggerPosting}>Self Service Trigger</button>
            </div>
            
            {/* Display converted images */}
            <div>
                {isLoading && <div>Loading...</div>}
                {isError && <div>Error getting or posting images</div>}
                <button type="submit" onClick={handleSubmit}>Post Content</button>
                <h2>Images that were posted to instagram</h2>
                <div  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'  }}>
                    {base64Images.map((base64, index) => (
                        <div key={index}>
                            <img src={base64} alt={`Converted code into visual ${index + 1}`} style={{ width: '50px' }}/>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                {isLoadingGetAll && <div>Loading...</div>}
                {isErrorGetAll && <div>Error fetching images</div>}
                <button type="submit" onClick={displayAllImages}>Get All Images</button>
                <h2>Images that exist in the database</h2>
                <div  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'  }}>
                    {allExistingBase64Images.map((base64String, index) => (
                        <div key={index} >
                            <img src={`data:image/jpeg;base64,${base64String}`} alt={`Code visual ${index}`} style={{ width: '50px' }}/>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                {isLoadingGetData && <div>Loading...</div>}
                {isErrorGetData && <div>Error fetching DB Data</div>}
                <button type="submit" onClick={getDBData}>Get DB Data</button>
                <div>
                    <h2>All data in the database</h2>
                    <TableComponent data={dataFromDB} />
                </div>

            </div>

        </div>
  
    )

}

export default Initializer;