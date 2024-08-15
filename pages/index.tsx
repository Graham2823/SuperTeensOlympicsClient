import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Table , Image} from 'react-bootstrap'; // Correct import statement
import { UserContext } from '@/context/userContext';

interface CommunityCenter {
  'communityCenterName': string;
  'communityCenterPoints': number;
}

const Index = () => {
  const [standings, setStandings] = useState<CommunityCenter[]>([]);
  const {user} = useContext(UserContext)

  useEffect(() => { 
    try {
      axios.get('https://superteensolympicsserver-1.onrender.com')
        .then((res) => {
          setStandings(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch(e) {
      console.log("error getting community centers:", e);
    }
  }, []);

  const downloadCSV = () => {
    // Implement download logic here
    window.open(`https://superteensolympicsserver-1.onrender.com/downloadCSV`);
  };

  return (
    <div className='homePage'>
      <div>
        <div className='logoContainer'>
        <Image src={'/olympicRings.png'} alt='olympic rings' className='logoImage'/>
        <Image src={'/BCYFLogo.png'} alt='olympic rings' className='logoImage'/>
        </div>
        <h1>SuperTeens Olympics 2024</h1>
        <h3>NOTE- These are not the final standings. We are still adding a few more things!</h3>
      </div>
      {standings.length > 0 &&
        <Table striped hover className='standingsTable'>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Community Center</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((center, index) => (
              <tr key={index}> 
                <td>{index + 1}</td>
                <td>{center.communityCenterName}</td>
                <td>{center.communityCenterPoints}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      }
      {/* {user && user.adminID && 
      <button onClick={()=>downloadCSV()}>Download Standings</button>
      } */}
    </div>
  );
}

export default Index;
