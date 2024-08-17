import React, { useState } from "react";

const TableComponent = ({ data }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const eraseEntry = async (itemID) => {

      setIsLoading(true)
      setIsError(false)

      const deleteEntry = `https://image-host-je09.onrender.com/imagehost/removeitem/${itemID}`

      try {

        const response = await fetch(deleteEntry,{

          method: 'DELETE',
          headers: { 'Access-Control-Allow-Origin': 'http://localhost:3000' }

        })

        if(!response.ok){
          setIsError(true)
        } else {
          const data = await response.text()
          console.log(data)
        }

      } catch(error){
        setIsError(true)
        console.log(error)
    }

      setIsLoading(false)

    }

    return (
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={styles.header}>Remove Item</th>
            <th style={styles.header}>ID</th>
            <th style={styles.header}>Event ID</th>
            <th style={styles.header}>Date</th>
            <th style={styles.header}>Supplier</th>
            <th style={styles.header}>Image Type</th>
            <th style={styles.header}>Product Type</th>
            <th style={styles.header}>Footwear</th>
            <th style={styles.header}>Accessories</th>
            <th style={styles.header}>Coats & Jackets</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td style={styles.cell}><button type="submit" onClick={() => eraseEntry(item.id)}>Delete</button></td>
              <td style={styles.cell}>{item.id}</td>
              <td style={styles.cell}>{item.eventID}</td>
              <td style={styles.cell}>{item.date}</td>
              <td style={styles.cell}>{item.supplier}</td>
              <td style={styles.cell}>{item.imageType}</td>
              <td style={styles.cell}>{item.productType}</td>
              <td style={styles.cell}>{item.footwear64s && (<img src={`data:image/jpeg;base64,${item.footwear64s}`} alt={`N/A`} style={{ width: '200%' }}/>)}</td>
              <td style={styles.cell}>{item.accessories64s && (<img src={`data:image/jpeg;base64,${item.accessories64s}`} alt={`N/A`} style={{ width: '200%' }}/>)}</td>
              <td style={styles.cell}>{item.coatsandjackets64s && (<img src={`data:image/jpeg;base64,${item.coatsandjackets64s}`} alt={`N/A`} style={{ width: '200%' }}/>)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  const styles = {
    header: {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'left',
    },
    cell: {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'left',
    },
  };
  
  export default TableComponent;