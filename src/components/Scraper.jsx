import React, { useEffect, useState } from "react";
import Papa from 'papaparse';
import Data from '../files/Products.csv'
import Initializer from './Initializer';

const Scraper = () => {

    // const payload = {
    //     api_key: '31e11eab337da7d2ff1778cae43d1db2',
    //     url: 'https://www.asos.com/api/product/search/v2/categories/4210?offset=144&store=COM&lang=en-GB&currency=GBP&rowlength=3&channel=desktop-web&country=GB&keyStoreDataversion=h7g0xmn-38&advertisementsPartnerId=100712&advertisementsOptInConsent=false&limit=72',
    //     headers: {
    //       'accept': 'application/json, text/plain, */*',
    //       'accept-language': 'en-US,en;q=0.9,en-GB;q=0.8',
    //       'asos-c-name': '@asosteam/asos-web-product-listing-page',
    //       'asos-c-plat': 'web',
    //       'asos-c-ver': '1.2.0-140e78c7-29',
    //       'asos-cid': '28ce0065-d348-4750-8be6-e6a180d1562d',
    //       'cache-control': 'no-cache',
    //       'pragma': 'no-cache',
    //       'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    //       'sec-ch-ua-mobile': '?0',
    //       'sec-ch-ua-platform': '"Windows"',
    //       'sec-fetch-dest': 'empty',
    //       'sec-fetch-mode': 'cors',
    //       'sec-fetch-site': 'same-origin',
    //       "cookie": "featuresId=9ec56809-9490-4096-a969-7866a7172aac; FPID=FPID2.2.b8E4mSE4m2cbuMfIZqPo05la1T3L1dniscQ1licL78E%3D.1681631918; browseCountry=GB; browseCurrency=GBP; browseLanguage=en-GB; browseSizeSchema=UK; storeCode=COM; currency=1; s_ecid=MCMID%7C55383176303907422680671264703225200195; _cs_c=0; stc-welcome-message=cappedPageCount=2; OptanonAlertBoxClosed=2024-03-06T09:02:47.887Z; asosAffiliate=affiliateId=25374; _pxvid=93fc87bf-e1e8-11ee-84a5-ac89927b5197; forterToken=c57d8e5d4fc84e6e99987cfcd0298791_1710409958586__UDF43-m4_15ck; floor=1001; asos=PreferredSite=&currencyid=1&currencylabel=GBP&customerguid=32f7f575e24342a7a70cd3accd81c1ac&topcatid=1001; asos-anon12=38fbb4e158274a29887e801e9a3d7cfd; geocountry=GB; PIM-SESSION-ID=OmyD5IrHwnyScDmV; akacd_PIM-prd_ah_rollout=3888343457~rv=81~id=796535f23076d156deab6ff7ebf5cfc9; _aphck={\"aphc2\":2,\"aphc1\":2}; AMCVS_C0137F6A52DEAFCC0A490D4C%40AdobeOrg=1; s_cc=true; asos-ts121=6ec4df5a3cf6471085fb0cbb611152c6; asos-perx=38fbb4e158274a29887e801e9a3d7cfd||6ec4df5a3cf6471085fb0cbb611152c6; _ga=GA1.1.565236585.1681631918; _abck=C09E9A8742020A88E871D091D8BBD1FA~0~YAAQgdERApdWs3+OAQAAOO4rhAtVvNo5L4jeOAB7CHgH+JD/9dcjxE23XXtjm4+Q91L+TcJ6W9UYLbB0NAE9VH1nk/rb0i3/LTspO2uuiJHYXFyHepRE6iJA3GPm99IAdr3wVYmj8eGVSwd9L+e0K9y6LTJZ9yEAwaaYQejSPkLiPTRqtBBhEkfdsUREqglnxULDcZ56ZpDg8ByIEBx0AZwNqc47sVR+34QqHYShkGNOCMMWzdO+hLaaIw16JNioRG7f2J6som84wPxzqDHIx7e/Jf4BgZAiehG1CK1w4eEAJ4eUa8TG4Gdd6tIuJW/tM+DbhwvnBUAjJAzEmCoMMjBVu62JuxN6MIeDn5rcIIU0bwhghlfY1QY5s0BUNE43e02Cv0wAxqTt+gXA8j5FBCNI9NCfIg==~-1~-1~1711579373; siteChromeVersion=au=12&com=12&de=12&dk=12&es=12&fr=12&it=12&nl=12&pl=12&roe=12&row=12&ru=12&se=12&us=12; keyStoreDataversion=h7g0xmn-38; ak_bmsc=E88A6976C31FAAA705102623B32F0D77~000000000000000000000000000000~YAAQgdERAhFXs3+OAQAAt/krhBfV1vtVtK8Wh00sbtVmAMhC3zD2ghGZE23EjKQmjQo7lSQJxk20j6/ZiLqkDGm54PnYas6lI8I/unKG9+eehVmgdHkfHN2rAIVF07ZiKM6MB5GuL4svm9bbChQD1XqRyVJf+VB4HAqppk2/Yl3+9dkP95Sf6hopO8uNcaX+8mCXbHrvzksNHPH4H6ph2CMwK+Neg3FX8X3FSNrdwFDKC/kP2brup/nC/cVTxhy1MhoVB0R3wb1Ur05a6bY6oaRDC+VkTuaKCOku4m99I5uOHoua54G3wFBgI/b9W/sJQhVzogJIVRZE060dZdCclUc2JcvqgVB+kJVtY4vECMmpV8gS+gzjD2BBu5p4qTL6nNyeIH7KpQ==; asos-b-sdv629=h7g0xmn-38; AMCV_C0137F6A52DEAFCC0A490D4C%40AdobeOrg=-1303530583%7CMCMID%7C55383176303907422680671264703225200195%7CMCAAMLH-1712219268%7C6%7CMCAAMB-1712219268%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C0%7CMCOPTOUT-1711621668s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C3.3.0; bm_sz=269DAB312E7CBB5B5BAE52F867CF6F9A~YAAQgz9lX1vTNYKOAQAAL0NGhBezG+Jm+rUsDV5BiHVf8tSloxCXNBXYVYUGvIsPXQmkz/paP4R6KxPQRJ6Xd9yiGnl/lwcmh4C+LhrgItfZwIRz7eXyG+iR9NDMq/PRMRkEyp78W9nH2a+IcI0WKvKFtEbk4z/od0xLAROnreAJqgqr2oxPB+zoXaDOhL+zx3pxImolYJ8o/aUsgjbLHjyRnmlL0ufES6SdTu0xaBhNMw5T6GuB+shRLPAVhiWap2qdODRMjRqWyh8FEUTRcA5f4cuYQ+s6BgfW22/6AXx6Dv5D5GvtVS7JAp0I8fi/lnWjraWuuvBHrTjXCb7u/0vHbnDj+xnbnm+dqXkGwS1OIOkM0S85LPDaVm5sWTlhkfNX4sG5Vlg/qrdXw9q90MnJIqjvGxffUmg=~3748144~3290689; plp_columsCount=fourColumns; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Mar+28+2024+08%3A56%3A25+GMT%2B0000+(Greenwich+Mean+Time)&version=202401.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=abc93dc8-6497-4d0e-89d3-e5bc59be41ec&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A0%2CC0004%3A0&geolocation=GB%3BENG&AwaitingReconsent=false; s_pers=%20s_vnum%3D1711926000099%2526vn%253D12%7C1711926000099%3B%20gpv_p6%3D%2520%7C1711616261918%3B%20eVar225%3D2%7C1711617982505%3B%20visitCount%3D12%7C1711617982506%3B%20gpv_e231%3D59b47458-acca-4e29-8a26-6e48d4a17a32%7C1711617986073%3B%20s_invisit%3Dtrue%7C1711617986075%3B%20s_nr%3D1711616186076-Repeat%7C1743152186076%3B%20gpv_e47%3Dno%2520value%7C1711617986076%3B%20gpv_p10%3Ddesktop%2520com%257Ccategory%2520page%257C4210%2520page%25202%2520refined%7C1711617986077%3B; _cs_id=6a3e50af-2aff-aee0-dac1-22e435a5f506.1709715742.18.1711619358.1711614469.1628755191.1743879742354; _cs_s=1.0.0.1711621158639; _ga_1JR0QCFRSY=GS1.1.1711619377.44.0.1711619377.0.0.1138614824; FPLC=nqK%2FNszi0NjwiDPYETXvR7IhQ5%2BchQ62Se6N5J1ts%2Bj0zIZmt1%2FU%2BdEDAOkSxl%2BDs%2B0uaK3AruSzvuVdWOBSlv51iBoykOBt0cWUYeygpAOjm%2Fhyp3wv%2BCP%2Fhe%2F2Ug%3D%3D; RT=\"z=1&dm=asos.com&si=cb46ac10-a9d6-4f5d-b0ea-ad4a62c6ede9&ss=luac3b1r&sl=0&tt=0&bcn=%2F%2F02179910.akstat.io%2F&nu=zfd11k6b&cl=pw8ew\"; _s_fpv=true; s_sq=asoscomprod%3D%2526c.%2526a.%2526activitymap.%2526page%253Ddesktop%252520com%25257Ccategory%252520page%25257C4210%252520page%2525202%252520refined%2526link%253DLOAD%252520MORE%2526region%253Dplp%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c",
    //       "Referer": "https://www.asos.com/men/accessories/cat/?cid=4210&currentpricerange=5-295&page=3",
    //       "Referrer-Policy": "strict-origin-when-cross-origin"
    //   },
    //   "body": null,
    //   "method": "GET"
    // }
    
    // // html = requests.get('http://api.scraperapi.com', params=payload)
    
    // // soup = BeautifulSoup(html.text, "lxml")
    // // print(soup)

    // const url = `http://api.scraperapi.com`

    // const fetchAsos = async (event) => {

    //     event.preventDefault()

    //     try{

    //         const response = await fetch('http://api.scraperapi.com', {
    //             method: 'GET',
    //             api_key: '31e11eab337da7d2ff1778cae43d1db2',
    //             url: 'https://www.asos.com/api/product/search/v2/categories/4210?offset=144&store=COM&lang=en-GB&currency=GBP&rowlength=3&channel=desktop-web&country=GB&keyStoreDataversion=h7g0xmn-38&advertisementsPartnerId=100712&advertisementsOptInConsent=false&limit=72',
    //             headers: {
    //               'accept': 'application/json, text/plain, */*',
    //               'accept-language': 'en-US,en;q=0.9,en-GB;q=0.8',
    //               'asos-c-name': '@asosteam/asos-web-product-listing-page',
    //               'asos-c-plat': 'web',
    //               'asos-c-ver': '1.2.0-140e78c7-29',
    //               'asos-cid': '28ce0065-d348-4750-8be6-e6a180d1562d',
    //               'cache-control': 'no-cache',
    //               'pragma': 'no-cache',
    //               'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    //               'sec-ch-ua-mobile': '?0',
    //               'sec-ch-ua-platform': '"Windows"',
    //               'sec-fetch-dest': 'empty',
    //               'sec-fetch-mode': 'cors',
    //               'sec-fetch-site': 'same-origin',
    //               "cookie": "featuresId=9ec56809-9490-4096-a969-7866a7172aac; FPID=FPID2.2.b8E4mSE4m2cbuMfIZqPo05la1T3L1dniscQ1licL78E%3D.1681631918; browseCountry=GB; browseCurrency=GBP; browseLanguage=en-GB; browseSizeSchema=UK; storeCode=COM; currency=1; s_ecid=MCMID%7C55383176303907422680671264703225200195; _cs_c=0; stc-welcome-message=cappedPageCount=2; OptanonAlertBoxClosed=2024-03-06T09:02:47.887Z; asosAffiliate=affiliateId=25374; _pxvid=93fc87bf-e1e8-11ee-84a5-ac89927b5197; forterToken=c57d8e5d4fc84e6e99987cfcd0298791_1710409958586__UDF43-m4_15ck; floor=1001; asos=PreferredSite=&currencyid=1&currencylabel=GBP&customerguid=32f7f575e24342a7a70cd3accd81c1ac&topcatid=1001; asos-anon12=38fbb4e158274a29887e801e9a3d7cfd; geocountry=GB; PIM-SESSION-ID=OmyD5IrHwnyScDmV; akacd_PIM-prd_ah_rollout=3888343457~rv=81~id=796535f23076d156deab6ff7ebf5cfc9; _aphck={\"aphc2\":2,\"aphc1\":2}; AMCVS_C0137F6A52DEAFCC0A490D4C%40AdobeOrg=1; s_cc=true; asos-ts121=6ec4df5a3cf6471085fb0cbb611152c6; asos-perx=38fbb4e158274a29887e801e9a3d7cfd||6ec4df5a3cf6471085fb0cbb611152c6; _ga=GA1.1.565236585.1681631918; _abck=C09E9A8742020A88E871D091D8BBD1FA~0~YAAQgdERApdWs3+OAQAAOO4rhAtVvNo5L4jeOAB7CHgH+JD/9dcjxE23XXtjm4+Q91L+TcJ6W9UYLbB0NAE9VH1nk/rb0i3/LTspO2uuiJHYXFyHepRE6iJA3GPm99IAdr3wVYmj8eGVSwd9L+e0K9y6LTJZ9yEAwaaYQejSPkLiPTRqtBBhEkfdsUREqglnxULDcZ56ZpDg8ByIEBx0AZwNqc47sVR+34QqHYShkGNOCMMWzdO+hLaaIw16JNioRG7f2J6som84wPxzqDHIx7e/Jf4BgZAiehG1CK1w4eEAJ4eUa8TG4Gdd6tIuJW/tM+DbhwvnBUAjJAzEmCoMMjBVu62JuxN6MIeDn5rcIIU0bwhghlfY1QY5s0BUNE43e02Cv0wAxqTt+gXA8j5FBCNI9NCfIg==~-1~-1~1711579373; siteChromeVersion=au=12&com=12&de=12&dk=12&es=12&fr=12&it=12&nl=12&pl=12&roe=12&row=12&ru=12&se=12&us=12; keyStoreDataversion=h7g0xmn-38; ak_bmsc=E88A6976C31FAAA705102623B32F0D77~000000000000000000000000000000~YAAQgdERAhFXs3+OAQAAt/krhBfV1vtVtK8Wh00sbtVmAMhC3zD2ghGZE23EjKQmjQo7lSQJxk20j6/ZiLqkDGm54PnYas6lI8I/unKG9+eehVmgdHkfHN2rAIVF07ZiKM6MB5GuL4svm9bbChQD1XqRyVJf+VB4HAqppk2/Yl3+9dkP95Sf6hopO8uNcaX+8mCXbHrvzksNHPH4H6ph2CMwK+Neg3FX8X3FSNrdwFDKC/kP2brup/nC/cVTxhy1MhoVB0R3wb1Ur05a6bY6oaRDC+VkTuaKCOku4m99I5uOHoua54G3wFBgI/b9W/sJQhVzogJIVRZE060dZdCclUc2JcvqgVB+kJVtY4vECMmpV8gS+gzjD2BBu5p4qTL6nNyeIH7KpQ==; asos-b-sdv629=h7g0xmn-38; AMCV_C0137F6A52DEAFCC0A490D4C%40AdobeOrg=-1303530583%7CMCMID%7C55383176303907422680671264703225200195%7CMCAAMLH-1712219268%7C6%7CMCAAMB-1712219268%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C0%7CMCOPTOUT-1711621668s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C3.3.0; bm_sz=269DAB312E7CBB5B5BAE52F867CF6F9A~YAAQgz9lX1vTNYKOAQAAL0NGhBezG+Jm+rUsDV5BiHVf8tSloxCXNBXYVYUGvIsPXQmkz/paP4R6KxPQRJ6Xd9yiGnl/lwcmh4C+LhrgItfZwIRz7eXyG+iR9NDMq/PRMRkEyp78W9nH2a+IcI0WKvKFtEbk4z/od0xLAROnreAJqgqr2oxPB+zoXaDOhL+zx3pxImolYJ8o/aUsgjbLHjyRnmlL0ufES6SdTu0xaBhNMw5T6GuB+shRLPAVhiWap2qdODRMjRqWyh8FEUTRcA5f4cuYQ+s6BgfW22/6AXx6Dv5D5GvtVS7JAp0I8fi/lnWjraWuuvBHrTjXCb7u/0vHbnDj+xnbnm+dqXkGwS1OIOkM0S85LPDaVm5sWTlhkfNX4sG5Vlg/qrdXw9q90MnJIqjvGxffUmg=~3748144~3290689; plp_columsCount=fourColumns; OptanonConsent=isGpcEnabled=0&datestamp=Thu+Mar+28+2024+08%3A56%3A25+GMT%2B0000+(Greenwich+Mean+Time)&version=202401.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=abc93dc8-6497-4d0e-89d3-e5bc59be41ec&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A0%2CC0004%3A0&geolocation=GB%3BENG&AwaitingReconsent=false; s_pers=%20s_vnum%3D1711926000099%2526vn%253D12%7C1711926000099%3B%20gpv_p6%3D%2520%7C1711616261918%3B%20eVar225%3D2%7C1711617982505%3B%20visitCount%3D12%7C1711617982506%3B%20gpv_e231%3D59b47458-acca-4e29-8a26-6e48d4a17a32%7C1711617986073%3B%20s_invisit%3Dtrue%7C1711617986075%3B%20s_nr%3D1711616186076-Repeat%7C1743152186076%3B%20gpv_e47%3Dno%2520value%7C1711617986076%3B%20gpv_p10%3Ddesktop%2520com%257Ccategory%2520page%257C4210%2520page%25202%2520refined%7C1711617986077%3B; _cs_id=6a3e50af-2aff-aee0-dac1-22e435a5f506.1709715742.18.1711619358.1711614469.1628755191.1743879742354; _cs_s=1.0.0.1711621158639; _ga_1JR0QCFRSY=GS1.1.1711619377.44.0.1711619377.0.0.1138614824; FPLC=nqK%2FNszi0NjwiDPYETXvR7IhQ5%2BchQ62Se6N5J1ts%2Bj0zIZmt1%2FU%2BdEDAOkSxl%2BDs%2B0uaK3AruSzvuVdWOBSlv51iBoykOBt0cWUYeygpAOjm%2Fhyp3wv%2BCP%2Fhe%2F2Ug%3D%3D; RT=\"z=1&dm=asos.com&si=cb46ac10-a9d6-4f5d-b0ea-ad4a62c6ede9&ss=luac3b1r&sl=0&tt=0&bcn=%2F%2F02179910.akstat.io%2F&nu=zfd11k6b&cl=pw8ew\"; _s_fpv=true; s_sq=asoscomprod%3D%2526c.%2526a.%2526activitymap.%2526page%253Ddesktop%252520com%25257Ccategory%252520page%25257C4210%252520page%2525202%252520refined%2526link%253DLOAD%252520MORE%2526region%253Dplp%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c",
    //               "Referer": "https://www.asos.com/men/accessories/cat/?cid=4210&currentpricerange=5-295&page=3",
    //               "Referrer-Policy": "strict-origin-when-cross-origin"
    //           },
    //         });

    //         if(!response.ok){

    //             console.log("response failed")

    //         } else {

    //             // const data = await response.json()
    //             // console.log(data)
    //             const data1 = await response.text()
    //             const data2 = data1
    //             console.log(data2)

    //         }

    //     } catch(error){

    //         console.log(error)

    //     }

    // }

    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(Data);
            const reader = response.body.getReader();
            const result = await reader.read();
            const decoder = new TextDecoder("utf-8");
            const csvData = decoder.decode(result.value);
            const parsedData = Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true
            }).data;
            setData(parsedData);
        };
        fetchData();
    }, []);

    

    return(
        <div>

        {data.length ? (
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>ImageURL</th>
                        <th>ProductType</th>
                        <th>DateTime</th>
                        <th>EventID</th>
                        <th>Supplier</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.ID}</td>
                            <td>{row.Name}</td>
                            <td>{row.Price}</td>
                            <td>{row.ImageURL}</td>
                            <td>{row.ProductType}</td>
                            <td>{row.DateTime}</td>
                            <td>{row.EventID}</td>
                            <td>{row.Supplier}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : null}

        
        <Initializer data={data}/>
            {/* <button type="submit" onClick={fetchAsos}>Fetch</button> */}

        </div>
    )


}

export default Scraper;